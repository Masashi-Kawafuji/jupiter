import { RequestHandler } from 'express';
import { getManager, getCustomRepository } from 'typeorm';
import { validate } from 'class-validator';
import Post from '../entities/post';
import User from '../entities/user';
import Image from '../entities/image';
import PostImageUploadService from '../services/PostImageUploadService';
import PostRepository from '../repositories/PostRepository';
import TagRepository from '../repositories/TagRepository';
import Tag from '../entities/tag';

type SearchQuery = Record<'q' | 'offset' | 'limit', string>;

export const searchByPlainText: RequestHandler = async (req, res) => {
  const user = res.locals.user as User;
  const { q, offset, limit } = req.query as SearchQuery;
  const postRepository = getCustomRepository(PostRepository);
  const posts = await postRepository.search(q, offset, limit, { user });
  res.json(posts);
};

export const searchByTagName: RequestHandler = async (req, res) => {
  const user = res.locals.user as User;
  const { tagName } = req.params;
  const { offset, limit } = req.query as Omit<SearchQuery, 'q'>;
  const postRepository = getCustomRepository(PostRepository);
  const posts = await postRepository.findByTagName(
    tagName,
    offset,
    limit,
    user.id
  );
  res.json(posts);
};

export const postList: RequestHandler = async (req, res) => {
  const user = res.locals.user as User;
  const postRepository = getCustomRepository(PostRepository);
  const posts = await postRepository.findPublished({ user });
  res.json(posts);
};

export const postDetail: RequestHandler<{ postId: Post['id'] }> = async (
  req,
  res
) => {
  const user = res.locals.user as User;
  const postRepository = getCustomRepository(PostRepository);
  const post = await postRepository.findOneWithComments(req.params.postId, {
    user,
  });

  if (post) res.json(post);
  else res.status(404).json({ message: '投稿は見つかりませんでした。' });
};

export const createPost: RequestHandler = async (req, res, next) => {
  const user = res.locals.user as User;
  const post = new Post();
  const postRepository = getCustomRepository(PostRepository);
  postRepository.mergeFormData(post, { ...req.body, user });

  const errors = await validate(post, {
    forbidUnknownValues: true,
    validationError: { target: false },
    skipMissingProperties: true,
  });

  if (errors.length > 0) {
    res.status(422).json(errors);
  } else {
    const manager = getManager();
    await manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(post);
      // upload images
      if (req.files) {
        const postImageUploader = new PostImageUploadService(post);
        try {
          const files = req.files as Express.Multer.File[];
          await postImageUploader.uploadFromRequestFiles(files);
          const urls = postImageUploader.objectUrls.map((url) => ({ url }));
          const images = transactionalEntityManager.create(Image, urls);
          post.images = images;
          // save tags
          const tagRepository = transactionalEntityManager.getCustomRepository(
            TagRepository
          );
          const tags = await tagRepository.findAndCreate(post, user);
          post.tags = tags;
          await transactionalEntityManager.save(post);
        } catch (error) {
          next(error);
        }
      }
    });

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
    const postRepository = getCustomRepository(PostRepository);
    postRepository.mergeFormData(post, { ...req.body });

    const errors = await validate(post, {
      forbidUnknownValues: true,
      validationError: { target: false },
      skipMissingProperties: true,
    });

    if (errors.length > 0) {
      res.status(422).json(errors);
    } else {
      const postImageUploader = new PostImageUploadService(post);

      try {
        // delete images.
        const { imageIdsToDelete } = req.body;
        if (imageIdsToDelete) {
          await postImageUploader.delete(imageIdsToDelete);
          post.images = postImageUploader.post.images;
        }

        if (req.files) {
          // restrict quantity of images.
          const files = req.files as Express.Multer.File[];
          await postImageUploader.uploadFromRequestFiles(files);
          const urls = postImageUploader.objectUrls.map((url) => ({ url }));
          const images = manager.create(Image, urls);
          post.images.push(...images);
        }

        const tagRepository = getCustomRepository(TagRepository);
        const tags = await tagRepository.findAndCreate(post, user);
        post.tags = tags;

        await manager.save(post);
        res.json(post);
      } catch (error) {
        next(error);
      }
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
