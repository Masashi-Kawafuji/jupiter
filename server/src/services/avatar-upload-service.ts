import User from '../entities/user';
import ImageUploadService from './image-upload-service';

class AvatarUploadService extends ImageUploadService {
  constructor(userId: User['id']) {
    super(`${process.env.NODE_ENV}/profile/${userId}/avatar.jpg`, {
      width: 200,
      height: 200,
    });
  }
}

export default AvatarUploadService;
