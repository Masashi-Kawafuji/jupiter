import { RequestHandler } from 'express';
import { getManager, getRepository, IsNull } from 'typeorm';
import { validate } from 'class-validator';
import Post from '../entities/post';
import User from '../entities/user';
import PostImageUploadService from '../services/PostImageUploadService';
import Image from '../entities/image';

export const postList: RequestHandler = async (req, res) => {
  const { user } = res.locals as { user: User };
  const postRepository = getRepository(Post);
  const posts = await postRepository.find({
    where: { publishedAt: !IsNull() },
    order: {
      publishedAt: 'DESC',
    },
  });
  res.json(posts);
};

export const createPost: RequestHandler = async (req, res, next) => {
  const { user } = res.locals as { user: User };
  const manager = getManager();
  const post = manager.create(Post, {
    ...req.body,
    date: new Date(req.body.date),
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
    const newPost = await manager.save(post);
    if (req.files) {
      const postImageUploader = new PostImageUploadService(newPost.id);
      try {
        const files = req.files as { image: Express.Multer.File[] };
        const buffers = files.image.map((file) => file.buffer);
        await postImageUploader.upload(buffers);
        const images = postImageUploader.objectUrls.map((url) => {
          return manager.create(Image, {
            url,
            post: newPost,
          });
        });
        await manager.save(images);
      } catch (error) {
        next(error);
      }
    }

    res.status(201).json(post);
  }
};

export const deletePost: RequestHandler = async (req, res) => {
  const { user } = res.locals as { user: User };
  const manager = getManager();
  const post = await manager.findOne(Post, req.params.postId, {
    where: { user },
  });

  if (post) {
    await manager.remove(post);
    res.status(204).end();
  } else {
    res.status(404).json({ message: '投稿が見つかりませんでした。' });
  }
};
