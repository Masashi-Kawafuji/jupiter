import {
  EntityRepository,
  AbstractRepository,
  DeepPartial,
  Not,
  IsNull,
} from 'typeorm';
import Post from '../entities/post';
import Tag from '../entities/tag';
import User from '../entities/user';

type PostFormData = Record<'date' | 'body' | 'publish', string> & {
  user?: User;
};

@EntityRepository(Post)
class PostRepository extends AbstractRepository<Post> {
  public findPublished(user: User): Promise<Post[]> {
    return this.repository.find({
      where: { user, publishedAt: Not(IsNull()) },
      order: {
        date: 'DESC',
      },
    });
  }

  public findOneWithComments(
    id: number | string,
    user: User
  ): Promise<Post | undefined> {
    return this.repository.findOne(id, {
      where: { user },
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
