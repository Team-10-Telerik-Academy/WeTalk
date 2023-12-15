import axios from 'axios';
import { GIPHY_API_KEY, GIPHY_API_URL } from '../common/constants';

export const searchGifs = async (query: string): Promise<string[]> => {
    try {
      const response = await axios.get(`${GIPHY_API_URL}/search`, {
        params: {
          api_key: GIPHY_API_KEY,
          q: query,
          limit: 10,
          rating: 'g'
        },
      });
  
      const gifs = response.data.data.map((gif: any) => gif.images.downsized.url);
      return gifs;
    } catch (error) {
      console.error('Error fetching GIFs:', error);
      return [];
    }
  };


  export const trendingGifs = async () => {
    try {
        const response = await axios.get(`${GIPHY_API_URL}/trending`, {
            params: {
                api_key: GIPHY_API_KEY,
                limit: 10,
                rating: 'g'
              }, 
        })
        const gifs = response.data.data.map((gif: any) => gif.images.downsized.url);
      return gifs;
    } catch (error) {
        console.error('Error fetching GIFs:', error);
        return [];
      }
  }