import { NotionAPI } from 'notion-client';

const notionClient = new NotionAPI({
    authToken: process.env.NEXT_PUBLIC_NOTION_TOKEN,
    activeUser: process.env.NEXT_PUBLIC_NOTION_USER
});

export default notionClient;
