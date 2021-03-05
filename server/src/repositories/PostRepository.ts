import {
  EntityRepository,
  AbstractRepository,
  Not,
  IsNull,
  Like,
  FindConditions,
  DeepPartial,
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
    query: string,
    offset: string,
    limit: string,
    conditions: FindConditions<Post>
  ): Promise<Post[]> {
    return this.repository.find({
      where: {
        ...conditions,
        body: Like(`%${query}%`),
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
    conditions: DeepPartial<Post>
  ): Promise<Post[]> {
    const { user } = conditions;
    if (!user) throw new Error('The user does not exist.');

    return this.repository
      .createQueryBuilder('post')
      .innerJoinAndSelect(
        'post_tags_tag',
        'joinTable',
        'joinTable.postId = post.id'
      )
      .innerJoinAndSelect('tag', 'tag', 'tag.id = joinTable.tagId')
      .where('post.userId = :userId AND tag.name = :tagName', {
        userId: user.id,
        tagName: `#${tagName}`,
      })
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
    id: number | string,
    conditions: FindConditions<Post>
  ): Promise<Post | undefined> {
    return this.repository.findOne(id, {
      where: conditions,
      relations: ['comments'],
    });
  }

  public merge(post: Post, { date, body, publish, user }: PostFormData): Post {
    return this.repository.merge(post, {
      date: new Date(date),
      body,
      publishedAt: publish ? new Date() : post.publishedAt,
      user,
      tags: this.createTags(body, user || post.user),
    });
  }

  private createTags(postBody: Post['body'], user: User): Tag[] {
    const regex = new RegExp(' #\\w+', 'g');
    const tagNames = postBody.match(regex);
    const tagAttributes: DeepPartial<Tag>[] = [];

    if (tagNames) {
      tagNames.forEach((name) => {
        tagAttributes.push({ name, user });
      });
    }

    return this.manager.create(Tag, tagAttributes);
  }
}

export default PostRepository;
