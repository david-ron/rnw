import React from 'react';
import axios from 'axios';
import List from './List';

class Spotify extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            search_term: '',
            search_results: []
        }

        this.search_button_ref = React.createRef();
    }

    /**
     * trivial example of refs
     * we could have also bind keyUp of input directly to searchSpotify()
     * 
     * @param {*} event keyUp event, contains key code pressed
     */
    triggerSearchButton(event) {
        event.preventDefault();

        // ENTER = 13
        if (event.keyCode === 13) {
            // trigger click on ref'ed search button
            this.search_button_ref.current.click();
        }
    }

    trackSearchTerm(event) {
        var search_term = event.target.value;
        // console.log(`[Spotify.jsx] ${search_term}`);

        this.setState({
            search_term: search_term
        });
    }

    searchSpotify() {
        axios.get(`/spotify/search/${this.state.search_term}`)
            .then((res) => {
                // debugger;
                // console.log(res.data);

                var search_results = res.data;
                var squashed_results = search_results.map(function(track) {
                    return {
                        id: track.id,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        title: track.name
                    };
                });

                // console.log(squashed_results);

                this.setState({
                    search_results: squashed_results
                });
            })
            .catch((err) => {
                console.log(`[Spotify.jsx] search error: ${err}`);
            });
    }

    render() {
        return (
            <div className="spotify_modal">
                <div className="spotify_wrapper">
                    <div className="close_form">
                        <span onClick={this.props.hideSpotify}>[🗙]</span>
                    </div>
                    <h3>search Spotify</h3>
                    <div className="spotify_input">
                        <input type="text" 
                               onChange={ (event) => this.trackSearchTerm(event) }
                               onKeyUp={ (event) => this.triggerSearchButton(event) } />
                        <button onClick={() => this.searchSpotify()}
                                ref={this.search_button_ref}>
                            Search
                        </button>
                    </div>
                    <List list={this.state.search_results}
                          display_type={"spotify_api"}
                          toggleItem={this.props.toggleItemFromSpotify}
                          isInStateList={this.props.isInStateList} />
                </div>
            </div>
        );
    }
}

export default Spotify;
