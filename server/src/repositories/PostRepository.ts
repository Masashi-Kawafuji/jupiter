import {
  EntityRepository,
  AbstractRepository,
  Not,
  IsNull,
  Like,
  FindConditions,
} from 'typeorm';
import Post from '../entities/post';
import Tag from '../entities/tag';
import User from '../entities/user';

type PostFormData = Record<'date' | 'body' | 'publish', string> & {
  user?: User;
};

@EntityRepository(Post)
class PostRepository extends AbstractRepository<Post> {
  public search(
    q: string,
    offset: string,
    limit: string,
    conditions: FindConditions<Post>
  ): Promise<Post[]> {
    return this.repository.find({
      where: {
        ...conditions,
        body: Like(`%${q}%`),
        publishedAt: Not(IsNull()),
      },
      skip: parseInt(offset, 10),
      take: parseInt(limit, 10),
      order: {
        date: 'DESC',
      },
    });
  }

  public async findByTagName(
    tagName: Tag['name'],
    offset: string,
    limit: string,
    userId: User['id']
  ): Promise<Post[]> {
    return this.repository
      .createQueryBuilder('post')
      .innerJoinAndSelect(
        'post_tags_tag',
        'post_tags_tag',
        'post_tags_tag.postId = post.id'
      )
      .innerJoinAndSelect('tag', 'tag', 'tag.id = post_tags_tag.tagId')
      .where('post.userId = :userId', { userId })
      .andWhere('post.publishedAt IS NOT NULL')
      .andWhere('tag.name = :tagName', { tagName: `#${tagName}` })
      .orderBy('post.date', 'DESC')
      .skip(parseInt(offset, 10))
      .take(parseInt(limit, 10))
      .getMany();
  }

  public findPublished(conditions: FindConditions<Post>): Promise<Post[]> {
    return this.repository.find({
      where: { ...conditions, publishedAt: Not(IsNull()) },
      order: {
        date: 'DESC',
      },
    });
  }

  public findOneWithComments(
    id: Post['id'],
    userId: User['id']
  ): Promise<Post | undefined> {
    return this.repository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.comments', 'comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('post.id = :id AND post.userId = :userId', { id, userId })
      .getOne();
  }

  public merge(post: Post, { date, body, publish, user }: PostFormData): Post {
    return this.repository.merge(post, {
      date: new Date(date),
      body,
      publishedAt: publish ? new Date() : post.publishedAt,
      user,
    });
  }
}

export default PostRepository;
