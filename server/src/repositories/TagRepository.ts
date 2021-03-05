import { DeepPartial, EntityRepository, Repository } from 'typeorm';
import Post from '../entities/post';
import Tag from '../entities/tag';
import User from '../entities/user';

@EntityRepository(Tag)
class TagRepository extends Repository<Tag> {
  public async findAndCreate(post: Post, user: User): Promise<Tag[]> {
    const matchResult = this.parseHashTags(post.body);
    const findConditions = matchResult.map((name) => ({ name, user }));
    const existingTags = await this.find({ where: findConditions });
    const existingNames = existingTags.map((tag) => tag.name);
    const names = matchResult.filter((name) => !existingNames.includes(name));
    const properties = names.map((name) => ({ name, user }));
    const newTags = this.create(properties);

    return [...newTags, ...existingTags];
  }

  /* eslint-disable class-methods-use-this */
  private parseHashTags(postBody: Post['body']): Tag['name'][] {
    const regex = new RegExp('(^| )#\\w+', 'g');
    const matchResult = postBody.match(regex);
    return matchResult
      ? matchResult.map((result) => result.replace(new RegExp(' ?#'), ''))
      : [];
  }
}

export default TagRepository;
