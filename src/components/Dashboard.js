import React, { Component } from "react";

import classnames from "classnames";
import Loading from "./Loading";
import Panel from "./Panel";

const data = [
  {
    id: 1,
    label: "Total Photos",
    value: 10
  },
  {
    id: 2,
    label: "Total Topics",
    value: 4
  },
  {
    id: 3,
    label: "User with the most uploads",
    value: "Allison Saeng"
  },
  {
    id: 4,
    label: "User with the least uploads",
    value: "Lukas Souza"
  }
];


class Dashboard extends Component {
  state = {
    loading: false,
    focused: null
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

    return (
      <main className={dashboardClasses}>
        {!this.state.focused ?
        data.map((panel)=>(
          <Panel key={panel.id} id={panel.id} label={panel.label} value = {panel.value} onSelect={() => this.selectPanel(panel.id)} />
        )) :
        data.filter((panel) => (this.state.focused === panel.id)).map((panel)=>(
          <Panel key={panel.id} id={panel.id} label={panel.label} value = {panel.value} onSelect={() => this.selectPanel(panel.id)}/>
        ))
        }
      </main>
    );
  }
}

export default Dashboard;
