import {
  EntityRepository,
  Repository,
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
class PostRepository extends Repository<Post> {
  public search(
    q: string,
    offset: string,
    limit: string,
    conditions: FindConditions<Post>
  ): Promise<Post[]> {
    return this.find({
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
    return this.createQueryBuilder('post')
      .innerJoinAndSelect(
        'post_tags_tag',
        'post_tags_tag',
        'post_tags_tag.postId = post.id'
      )
      .innerJoinAndSelect('tag', 'tag', 'tag.id = post_tags_tag.tagId')
      .where('post.userId = :userId', { userId })
      .andWhere('post.publishedAt IS NOT NULL')
      .andWhere('tag.name = :tagName', { tagName })
      .orderBy('post.date', 'DESC')
      .skip(parseInt(offset, 10))
      .take(parseInt(limit, 10))
      .getMany();
  }

  public findPublished(conditions: FindConditions<Post>): Promise<Post[]> {
    return this.find({
      where: { ...conditions, publishedAt: Not(IsNull()) },
      order: {
        date: 'DESC',
      },
    });
  }

  public findOneWithComments(
    id: Post['id'],
    conditions: FindConditions<Post>
  ): Promise<Post | undefined> {
    return this.findOne(id, {
      relations: ['comments'],
      where: conditions,
    });
  }

  public mergeFormData(
    post: Post,
    { date, body, publish, user }: PostFormData
  ): Post {
    return this.merge(post, {
      date: new Date(date),
      body,
      publishedAt: publish ? new Date() : post.publishedAt,
      user,
    });
  }
}

export default PostRepository;
