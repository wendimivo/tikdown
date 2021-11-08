import {getFetch} from '..';
import {handleException} from '../decorators';
import {BaseProvider, ExtractedInfo} from './baseProvider';

/**
 * @class TTDownloader
 */
export class TTDownloader extends BaseProvider {
  /**
     * @return {string}
     */
  public resourceName(): string {
    return 'tt';
  }

  public client = getFetch('https://ttdownloader.com');

  /**
   *
   * @param {string} url - Video TikTok URL
   * @return {Promise<ExtractedInfo>}
   */
  @handleException
  public async fetch(url: string): Promise<ExtractedInfo> {
    // getting token and cookies
    const firstResponse = await this.client('./');
    const token = (firstResponse.body
        .match(/name="token" value="(.*)?"/) as string[])[1];
    const videoResponse = await this.client.post('./req', {
      form: {
        'token': token,
        'format': '',
        'url': url,
      },
      headers: {
        'Origin': 'https://ttdownloader.com',
        'Referer': 'https://ttdownloader.com',
        'Cookie': firstResponse.headers['cookie'],
      },
    });

    return this.extract(videoResponse.body);
  }

  /**
   *
   * @param {string} html - HTML Raw
   * @return {ExtractedInfo}
   */
  extract(html: string): ExtractedInfo {
    console.log(html);
    return {
      'error': '',
    };
  }
};
