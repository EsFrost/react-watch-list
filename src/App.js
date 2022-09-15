import './App.css';
import * as React from 'react';
import { v4 as uuid } from 'uuid';

const movies = [
  {
    title: 'Movie One',
    type: 'movie',
    episodes: 1,
    currentEp: 0,
    id: 1,
  },
  {
    title: 'Series One',
    type: 'series',
    episodes: 13,
    currentEp: 1,
    id: 2,
  },
  {
    title: 'Anime Movie One',
    type: 'anime-movie',
    episodes: 1,
    currentEp: 0,
    id: 3,
  },
  {
    title: 'Anime Series One',
    type: 'anime-series',
    episodes: 23,
    currentEp: 4,
    id: 4,
  },
];

//function for using localstorage
/*const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, setValue]);
};*/

const Form = ({ onAddSubmit, onInputChange }) => (
  <>
  <form onSubmit={onAddSubmit}>
    <label htmlFor="ftitle">Title</label>
    <input type="text" id="ftitle" name="title" onChange={onInputChange} />
    <br />
    <label htmlFor="type">Type</label>
    <select name="type" id="ftype" onChange={onInputChange}>
      <option value="movie">movie</option>
      <option value="anime-movie">anime-movie</option>
      <option value="series">series</option>
      <option value="anime-series">anime-series</option>
    </select>
    <br />
    <label htmlFor="fepisodes">Episodes</label>
    <input type="number" id="fepisodes" name="episodes" min="0" defaultValue="1" onChange={onInputChange} />
    <br />
    <label htmlFor="fcurrent">Watched episodes</label>
    <input type="number" id="fcurrent" name="currentEp" min="0" defaultValue="0" onChange={onInputChange} />
    <br />
    <button className="button button-add" type="submit">Add</button>
    <br />
  </form>
  
  </>
);

const List = ({ list, onDeleteItem, onEditItem, onCountUp, onCountDown }) => (
  <>
  <ul>
    <li className="item">
      <span className="titleHeader">Title</span>
      <span className="typeHeader">Type</span>
      <span className="episodesHeader">Episodes</span>
    </li>
    {list.map((item) => (
      <li key={item.id} className="item" id={item.id}>
        <span className="title">{item.title}</span>
        <span className="type">{item.type}</span>
        <span className="episodes">
          <span onClick={() => onCountDown(item.id)} style={{color: 'blue', fontSize: '20px', cursor: 'pointer'}}>-</span>
          {item.currentEp}/{item.episodes}
          <span onClick={() => onCountUp(item.id)} style={{color: 'blue', fontSize: '20px', cursor: 'pointer'}}>+</span>
        </span>
        <span>
          <button className="button button-edit" type="button" onClick={() => onEditItem(item)}>Edit</button>
        </span>
        <span>
          <button className="button button-delete" type="button" onClick={() => onDeleteItem(item.id)}>Delete</button>
        </span>
      </li>
    ))}
  </ul>
  </>
);

const App = () => {

  const [movie, setMovie] = React.useState(movies);
  const [inputs, setInputs] = React.useState({});

  //adds to current episode counter
  const episodeCountUp = (id) => {

    const newState = movie.map(item => {
      if (item.id === id && item.currentEp < item.episodes) {
        item.currentEp++;
        return item;
      }
      return item;
    });
    
    setMovie(newState);
  };

  //subtracks from current episode counter
  const episodeCountDown = (id) => {

    const newState = movie.map(item => {
      if (item.id === id && item.currentEp > 0) {
        item.currentEp--;
        return item;
      }
      return item;
    });

    setMovie(newState);

    console.log(movie);
  };

  //handles the input in forms
  const handleChangeInput = (event) => {
    const key = event.target.name;
    const value = event.target.value;
    const newId = uuid();

    //initial values if empty
    if (!inputs.id) {
      setInputs(values => ({...values, 'id': newId}));
    }

    if (!inputs.type) {
      inputs.type = 'movie';
    }

    if (!inputs.currentEp) {
      inputs.currentEp = 0;
    }

    if (!inputs.episodes) {
      inputs.episodes = 1;
    }

    setInputs(values => ({...values, [key]: value}));
  };

  //adds the movie to array object
  const handleAddMovie= (event) => {
    event.preventDefault();
     //check if title already exists and sets found
     const titleCheck = movie.filter(item => item.title.toLowerCase() === inputs.title.toLowerCase());  
    //check if title is empty or it already exists
    if (inputs.title === '' || !inputs.title) {
      //add a modal!
      alert('A title is necessary!');
      return;
    }
    else if (titleCheck[0]) {
      //add a modal!
      alert('Title already exists');
      return;
    }
    //check if current episodes are exceeding total episodes
    if (inputs.currentEp > inputs.episodes) {
      //add a modal!
      alert('Watched episodes can\'t be more than the existing ones!');
      return;
    }
    //check if movie has more than one episode
    if ((inputs.type === 'movie' || inputs.type === 'anime-movie') && inputs.episodes > 1) {
      //add a modal
      alert('Movies don\'t have episodes');
      inputs.episodes = 1;
    }

    setMovie([...movie, inputs]);
    //clears form inputs and resets the object
    event.target.reset();
    setInputs({});
  };

  //remove a movie
  const handleRemoveMovie = (id) => {

    const item = movie.filter(movie => movie.id !== id);
    
    setMovie(item);
  };

  const handleEditMovie = (item) => {

  };

  return (
    <>
      <Form
        onAddSubmit={handleAddMovie}
        onInputChange={handleChangeInput}
      ></Form>
      <List 
        onCountDown={episodeCountDown} 
        onCountUp={episodeCountUp} 
        onAddItem={handleAddMovie} 
        onEditItem={handleEditMovie} 
        onDeleteItem={handleRemoveMovie} 
        list={movie}>
      </List>
    </>
  );
};

export default App;
