import React from 'react';
import ResourceTn from './ResourceTn';

export default class Resources extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: null,
      agentSelectSkill: null,
      skillGrid: <div></div>
    };
    this._renderAgents = this._renderAgents.bind(this);
    this._renderSkillsList = this._renderSkillsList.bind(this);
  }
  componentDidMount() {
    skillEvt.on('skillsList', skills => {
      this._renderSkillsList(skills);
    });
  }
  componentDidUpdate(newProps, newState) {
    if(this.props.loggedIn) {
      if(this.props.resources.length === 0) {
        uccx.listRsrc().then(rsrcs => {
          //set an expand property on the resources
          var resources = rsrcs.resource.map(rsrc => {
            rsrc.expand = false;
            return rsrc;
          });
          this.props.onRsrcs(resources);
          this.setState({resources: resources});
        }).catch(err => console.log(err));
      }
    }
  }
  render() {
    var agentTN;
    if(this.state.resources) {
      agentTN = this.state.resources;
    }
    return (
      <div className='row'>
        <div className='col-sm-offset-3'>
          {agentTN ? this._renderAgents(agentTN) : <div></div>}
        </div>
        <div className='col-sm-offset-8'>
          {this.state.skillGrid}
        </div>
      </div>
    );
  }
  _renderAgents(agents) {
    return agents.map((agent, idx) => {
      return (
        <ResourceTn key={idx}
                    index={idx}
                    agent={agent}
                    setAgentSkill={this._setAgentSel.bind(this)}
                    agentSelectSkill={this.state.agentSelectSkill}
                    onExpand={this._expand.bind(this)}/>
      );
    });
  }
  _expand(agent, index) {
    var resources = this.state.resources;
    resources[index] = agent;
    this.setState({resources : resources});
  }
  _setAgentSel(userId) {
    this.setState({agentSelectSkill: userId});
  }
  _renderSkillsList(ccxSkills) {
    ccxSkills.push(undefined);
    var skillTxtArea = (
      <div style={{
          border: '1px solid grey',
          margin: '0 35px 0 35px'
        }}>
        <h5 style={{marginLeft: '10px'}}>UCCX Skills</h5>
        <div className='form-horizontal'>
          {ccxSkills.map((skill, i) => {
            if(skill) {
              return (
                <div key={i} style={{border:'none'}} className='form-control'>
                <button
                  className='btn btn-md btn-link'>
                  {skill}
                </button>
                </div>
              )
            } else {
              return (
                <div key={i} style={{border:'none'}} className='form-control'>
                  <button className='btn btn-xs btn-block'>
                    <span className='glyphicon glyphicon-chevron-left'></span>
                    <span className='glyphicon glyphicon-chevron-left'></span>
                    <span className='glyphicon glyphicon-chevron-left'></span>
                  </button>
                </div>
              );
            }
          })}
        </div>
      </div>
    );
    this.setState({skillGrid: skillTxtArea});
  }
}
