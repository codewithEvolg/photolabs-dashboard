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

const panels = [
  { id: 1, label: "Total Photos", getValue: getTotalPhotos },
  { id: 2, label: "Total Topics", getValue: getTotalTopics },
  { id: 3, label: "User with the most uploads", getValue: getUserWithMostUploads },
  { id: 4, label: "User with the least uploads", getValue: getUserWithLeastUploads }
];

class Dashboard extends Component {
  //initial state setup
  state = {
    loading: true,
    focused: JSON.parse(localStorage.getItem("focused")) || null,
    photos: [],
    topics: []
  };

  selectPanel(id) {
    this.setState({ focused: this.state.focused === id ? null : id });
  }

  async componentDidMount() {
    try {
      const [photos, topics] = await Promise.all([
        fetch("http://localhost:8001/api/photos").then(response => response.json()),
        fetch("http://localhost:8001/api/topics").then(response => response.json())
      ]);
      
      this.setState({ loading: false, photos, topics });
    } catch (error) {
      console.error("Error fetching data:", error);
      this.setState({ loading: false });
    }
  }

  componentDidUpdate(_, prevState) {
    if (prevState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  render() {
    const { loading, focused } = this.state;
    const dashboardClasses = classnames("dashboard", { "dashboard--focused": focused });

    if (loading) {
      return <Loading />;
    }

    return (
      <main className={dashboardClasses}>
        {panels.map(panel => (
          <Panel
            key={panel.id}
            id={panel.id}
            label={panel.label}
            value={panel.getValue(this.state)}
            onSelect={() => this.selectPanel(panel.id)}
          />
        ))}
      </main>
    );
  }
}

export default Dashboard;