import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config(); // dotenv 초기화
export const notion = new Client({ auth: process.env.NOTION_API_KEY });
export const databaseId = process.env.NOTION_PAGE_ID;