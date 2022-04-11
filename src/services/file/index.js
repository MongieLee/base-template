import { postRequest, getRequest } from 'utils/request';

class FileService {
  static uploadFile(data) {
    return postRequest('/v1/file/upload', data).then((data) => {
      console.log('file data:');
      console.log(data);
      return data;
    });
  }

  static getFormData(file) {
    const formData = new FormData();
    formData.append('FormFile', file);
    formData.append('FileName', file.name);
    return formData;
  }
}


export default FileService;
