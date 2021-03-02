import { RequestHandler } from 'express';
import { getManager, Not, IsNull } from 'typeorm';
import { validate } from 'class-validator';
import Post from '../entities/post';
import User from '../entities/user';
import Image from '../entities/image';
import PostImageUploadService from '../services/PostImageUploadService';

export const postList: RequestHandler = async (req, res) => {
  const user = res.locals.user as User;
  const manager = getManager();
  const posts = await manager.find(Post, {
    where: { user, publishedAt: Not(IsNull()) },
    order: {
      publishedAt: 'DESC',
    },
  });
  res.json(posts);
};

export const createPost: RequestHandler = async (req, res, next) => {
  const user = res.locals.user as User;
  const { date, publish } = req.body;
  const manager = getManager();
  const post = manager.create(Post, {
    ...req.body,
    date: new Date(date),
    publishedAt: publish ? new Date() : null,
    user,
  });

  const errors = await validate(post, {
    forbidUnknownValues: true,
    validationError: { target: false },
    skipMissingProperties: true,
  });

  if (errors.length > 0) {
    res.status(422).json(errors);
  } else {
    await manager.save(post);
    // upload images
    if (req.files) {
      const postImageUploader = new PostImageUploadService(post);
      try {
        const files = req.files as Express.Multer.File[];
        await postImageUploader.uploadFromRequestFiles(files);
        const images = postImageUploader.objectUrls.map((url) =>
          manager.create(Image, { url })
        );
        post.images = images;
        await manager.save(post);
      } catch (error) {
        next(error);
      }
    }

    res.status(201).json(post);
  }
};

export const updatePost: RequestHandler = async (req, res, next) => {
  const user = res.locals.user as User;
  const manager = getManager();
  const post = await manager.findOne(Post, req.params.postId, {
    where: { user },
  });

  if (post) {
    manager.merge(Post, post, { ...req.body, date: new Date(req.body.date) });

    const errors = await validate(post, {
      forbidUnknownValues: true,
      validationError: { target: false },
      skipMissingProperties: true,
    });

    if (errors.length > 0) {
      res.status(422).json(errors);
    } else {
      await manager.transaction(async (transactionEntityManager) => {
        try {
          const postImageUploader = new PostImageUploadService(post);

          // delete images.
          const { deletableImageIds } = req.body;
          deletableImageIds.forEach((id: string) => {
            const index = post.images.findIndex(
              (image) => image.id === parseInt(id, 10)
            );
            post.images.splice(index, 1);
          });
          await postImageUploader.delete(deletableImageIds);

          if (req.files) {
            // restrict quantity of images.
            const files = req.files as Express.Multer.File[];
            await postImageUploader.uploadFromRequestFiles(files);
            const images = postImageUploader.objectUrls.map((url) =>
              transactionEntityManager.create(Image, { url })
            );
            post.images.push(...images);
            await transactionEntityManager.save(post);
          } else {
            await transactionEntityManager.save(post);
          }

          res.json(post);
        } catch (error) {
          next(error);
        }
      });
    }
  } else {
    res.status(404).json({ message: '指定された投稿は見つかりませんでした。' });
  }
};

export const deletePost: RequestHandler = async (req, res) => {
  const user = res.locals.user as User;
  const manager = getManager();
  const post = await manager.findOne(Post, req.params.postId, {
    where: { user },
  });

  if (post) {
    await manager.remove(post);
    res.status(204).end();
  } else {
    res.status(404).json({ message: '指定された投稿は見つかりませんでした。' });
  }
};
