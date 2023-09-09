import React, { Component } from "react";

import classnames from "classnames";
import Loading from "./Loading";
import Panel from "./Panel";
import {
  getTotalPhotos,
  getTotalTopics,
  getUserWithMostUploads,
  getUserWithLeastUploads
} from "helpers/selectors";

const data = [
  {
    id: 1,
    label: "Total Photos",
    getValue: getTotalPhotos
  },
  {
    id: 2,
    label: "Total Topics",
    getValue: getTotalTopics
  },
  {
    id: 3,
    label: "User with the most uploads",
    getValue: getUserWithMostUploads
  },
  {
    id: 4,
    label: "User with the least uploads",
    getValue: getUserWithLeastUploads
  }

];


class Dashboard extends Component {
  // initial state setup
  state = {
    loading: false,
    focused: null,
    photos: [],
    topics: []
  };

  selectPanel(id) {
    this.setState((previousState) => ({
      // set value of focused to null if the value of focused is currently set to a panel
      focused: previousState.focused !== null ? null : id
    }));
  }

  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));
    if (focused) {
      this.setState({ focused });
    }

    const urlsPromise = [
      "http://localhost:8001/api/photos",
      "http://localhost:8001/api/topics",
    ].map((url) => fetch(url).then(response => response.json()));

    Promise.all(urlsPromise)
      .then(([photos, topics]) => {
        this.setState({
          loading: false,
          photos: photos,
          topics: topics
        });
      });
  }
  

  componentDidUpdate(previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  render() {
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
     });

    if (this.state.loading) {
      return <Loading />;
    }

    console.log(this.state);

    return (
      <main className={dashboardClasses}>
        {!this.state.focused ?
        data.map((panel)=>(
          <Panel key={panel.id} id={panel.id} label={panel.label} value={panel.getValue(this.state)} onSelect={() => this.selectPanel(panel.id)} />
        )) :
        data.filter((panel) => (this.state.focused === panel.id)).map((panel)=>(
          <Panel key={panel.id} id={panel.id} label={panel.label} value={panel.getValue(this.state)} onSelect={() => this.selectPanel(panel.id)}/>
        ))
        }
      </main>
    );
  }
}
export default Dashboard;
