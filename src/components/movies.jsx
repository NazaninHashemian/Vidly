import React, { Component } from 'react';
import MoviesTable from './moviesTable.jsx';
import {getMovies} from '../services/fakeMovieService.js';
import ListGroup from './common/listGroup.jsx';
import Pagination from './common/pagination.jsx';
import { paginate } from '../utils/paginate.js';
import { getGenres } from '../services/fakeGenreService.js';
import _ from 'lodash';

class Movies extends Component {
  state = {  
    movies: getMovies(),
    genres:[],
    currentPage:1,
    pageSize: 4,
    sortColumn: {path: 'title', order: 'asc'}
 };

 componentDidMount(){
  const genres =[{_id: "", name: "All Genres"}, ...getGenres()];
  this.setState({movies:getMovies(), genres});
 }

  handleDelete = m => {
    const movies = this.state.movies.filter(movie => movie._id != m._id);
    this.setState({movies: movies});
  }

  handleLike = movie => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = {...movies[index]};
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  }

  handlePageChange= page =>{
    this.setState({currentPage: page});
  }

  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre , currentPage: 1});
  }

  handleSort = sortColumn => {

    this.setState({ sortColumn });
  }

  getpagedData = () =>{
    const {
      pageSize, 
      currentPage, 
      sortColumn,
      selectedGenre, 
      movies:allmovies
    } = this.state;

    const filtered = selectedGenre && selectedGenre._id ? 
    allmovies.filter(m => m.genre._id === selectedGenre._id)
    :allmovies;    
    
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const movies = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: movies};
  }

  render() {    
    const { length: count } = this.state.movies;
    const {
      pageSize, 
      currentPage, 
      sortColumn,
    } = this.state;

    if (count === 0) 
        return 'There are no movies in the database.';
        // (<P>There are no movies in the database.</P>);

    const {totalCount, data: movies} = this.getpagedData();
        
    return ( 
      <div className='row'>
        <div className="col-3">
          <ListGroup 
            items={this.state.genres} 
            // textProperty='name'
            // valueProperty='_id'
            selectedItem = {this.state.selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">

          {/* {this.state.movies.length === 0 && <P>There are no movies in the database.</P>} */}
          {/* <p>Showing {count} movies in the database.</p> */}
          <p>Showing {totalCount} movies in the database.</p>

          <MoviesTable 
            movies={movies}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />

          <Pagination 
            itemCount={totalCount}
            // itemCount={count} 
            // itemCount="abc"
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      
      </div>
  );
  }
}
export default Movies;