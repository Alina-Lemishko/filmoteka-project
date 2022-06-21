import axios from 'axios';
import 'tui-pagination/dist/tui-pagination.min.css';

const API_KEY = 'e7e97d56d25ec1e4b049a81d5db4fb3b';

axios.defaults.baseURL = 'https://api.themoviedb.org/3';

function getFilteredMovies(arr, genres) {
  return arr.map(result => {
    const arrayOfGenresName = result.genre_ids.map(
      id => genres.find(genre => genre.id === id).name
    );
    return {
      ...result,
      allGenres: arrayOfGenresName.join(', '),
      previewGenres: `${arrayOfGenresName.slice(0, 2).join(', ')}${
        arrayOfGenresName.length > 2 ? `, ...` : ''
      }`,
    };
  });
}

export async function getGenres() {
  try {
    const response = await axios.get(
      `genre/movie/list?api_key=${API_KEY}&language=en-US`
    );
    return response.data.genres;
  } catch (error) {
    console.log(error.message);
  }
}

export let copy = null;
export const MoviesService = {
  _page: 1,
  _param: 'popular',
  _query: '',
  async getMovies() {
    try {
      const response = await axios.get(
        `/movie/${this.param}?api_key=${API_KEY}&page=${this.page}`
      );
      const genres = await getGenres();
      let { results, total_pages } = response.data;

      results = getFilteredMovies(results, genres);
      copy = JSON.stringify({ results });
      return { results, total_pages };
    } catch (error) {
      console.log(error.message);
    }
  },

  get page() {
    return this._page;
  },

  set page(newPage) {
    this._page = newPage;
  },

  get param() {
    return this._param;
  },

  set param(newParam) {
    this._param = newParam;
  },

  async getMoviesBySearch() {
    try {
      const response = await axios.get(
        `/search/movie?api_key=${API_KEY}&page=${this.page}&query=${this._query}&include_adult=false`
      );
      const genres = await getGenres();
      let { results, total_pages } = response.data;

      results = getFilteredMovies(results, genres);
      copy = JSON.stringify({ results });
      return { results, total_pages };
    } catch (error) {
      console.log(error.message);
    }
  },

  get query() {
    return this._query;
  },

  set query(newQuery) {
    this._query = newQuery;
  },
};

export async function getMovieTrailer(idMovie) {
  try {
    const response = await axios.get(
      `/movie/${idMovie}/videos?api_key=${API_KEY}&language=en-US`
    );
    return response;
  } catch (error) {
    console.log(error.message);
  }
}