import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import JSZip from 'jszip';

@Injectable()
export class ZipProcessorService {
  private readonly logger = new Logger(ZipProcessorService.name, { timestamp: true });

  constructor(private readonly httpService: HttpService) {}

  public async downloadAndExtractZip(url: string, outputDir: string): Promise<void> {
    try {
      const response = await this.fetchUrl(url);
      const zip = await JSZip.loadAsync(response.data);

      this.ensureDirectoryExists(outputDir); // Add this line before extracting the zip
      await this.extractZip(zip, outputDir);
    } catch (error) {
      this.logger.error(`Error downloading and extracting zip: ${error}`);
    }
  }

  private async fetchUrl(url: string): Promise<any> {
    try {
      const requestConfig: AxiosRequestConfig = {
        method: 'GET',
        url,
        responseType: 'arraybuffer',
      };
      this.logger.debug(`Request options: ${JSON.stringify(requestConfig)}`);
      const result = await this.httpService.axiosRef(requestConfig);
      if (result && result.status === HttpStatus.OK && result.data) {
        this.logger.debug(`Response received`);
        return result;
      }
    } catch (error) {
      this.logger.error(`Error occurred in fetchUrl function: `, error);
      throw error;
    }
  }

  private ensureDirectoryExists(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private async extractZip(zip: JSZip, outputDir: string): Promise<void> {
    const entries = Object.values(zip.files);

    await Promise.all(
      entries.map(async (entry) => {
        const content = await entry.async('nodebuffer');
        const outputPath = path.join(outputDir, entry.name);

        if (entry.dir) {
          fs.mkdirSync(outputPath, { recursive: true });
        } else {
          fs.writeFileSync(outputPath, content);
        }
      }),
    );
  }
}
