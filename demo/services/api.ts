import axios from 'axios';

export class APIs {
  static async upload(data) {
    alert("Uploaded");
    const res = await axios.post('http://172.30.4.121:3333', data);
  }
}
