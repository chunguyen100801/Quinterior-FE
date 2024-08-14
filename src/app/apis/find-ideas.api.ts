'use server';

import { normalFetch } from '@/utils/fetch/fetch-service';
import { ImageRespone, PromptSuggest } from 'src/types/findIdeas.type';
import { ResponseApi } from 'src/types/utils.type';
const TAKE = 20;
export const getImages = async (
  page: number,
  searchPrompt: string,
  formData: FormData
) => {
  try {
    const offset = TAKE * page;
    const imageFile = formData.get('file');
    if (imageFile) {
      const form = new FormData();
      form.append('offset', offset.toString());
      form.append('limit', TAKE.toString());
      form.append('certainty', '0.8');
      form.append('file', imageFile);
      const res: ImageRespone = await normalFetch({
        api: `/api/v1/images/rooms/image-search`,
        method: 'POST',
        body: form,
      });
      return res ? res : undefined;
    }
    if (searchPrompt || searchPrompt !== '') {
      const res: ImageRespone = await normalFetch({
        api: `/api/v1/images/rooms/prompt-search?offset=${offset}&limit=${TAKE}&prompt=${searchPrompt}&certainty=${0.8}&search_type=ROOM`,
        method: 'GET',
      });

      return res ? res : undefined;
    }
    if (!searchPrompt || searchPrompt == '') {
      const res: ImageRespone = await normalFetch({
        api: `/api/v1/images/rooms/random-search?offset=${offset}&limit=${TAKE}`,
        method: 'GET',
      });
      return res ? res : undefined;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return undefined;
    }
  }
};

export const getSuggestPrompt = async (prompt: string) => {
  try {
    if (prompt == '') return;
    const res: ResponseApi<PromptSuggest> = await normalFetch({
      api: `/api/v1/ai-suggests/prompt`,
      method: 'POST',
      body: {
        prompt,
      },
    });
    return res ? res.data : undefined;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return undefined;
    }
  }
};
