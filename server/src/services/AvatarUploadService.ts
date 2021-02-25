import User from '../entities/user';
import SingleUploader from './uploader/single-uploader';

class AvatarUploadService extends SingleUploader {
  constructor(userId: User['id']) {
    super(`${process.env.NODE_ENV}/users/${userId}/avatar.jpg`, {
      width: 200,
      height: 200,
    });
  }
}

export default AvatarUploadService;
