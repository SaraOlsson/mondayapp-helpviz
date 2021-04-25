import React, { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css"
//Explore more Monday React Components here: https://style.monday.com/
import AttentionBox from "monday-ui-react-core/dist/AttentionBox.js"
import TaskItem from './components/TaskItem'
import TreeGraph from './components/TreeGraph'
import Example from './components/Example'
import ParentSize from '@visx/responsive/lib/components/ParentSize';

const monday = mondaySdk(
  {
    clientId: 'fbd2b4802317e8712e7a30007c9d67a8',
    apiToken: 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjEwNjkwNDkzMywidWlkIjoyMTQ5MzM0NiwiaWFkIjoiMjAyMS0wNC0xOFQxNjo0OTowMS42MDNaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6ODc0MDQ2MCwicmduIjoidXNlMSJ9.2dXiR-AnZI3mTwo1w8Z219DCzoTbC4gErvSsfLKC7O8'
  }
);

const FunctionApp = () => {

  const [context, setContext] = useState({})
  const [settings, setSettings] = useState({})
  const [boardData, setBoardData] = useState({})
  const [itemData, setItemData] = useState(undefined)
  const [boardIds, setBoardIds] = useState([])

  console.log(itemData)

  useEffect(() => {

    monday.api(`query { me { name } }`).then(res => {
      console.log(res);
      /* { data: { users: [{id: 12312, name: "Bart Simpson"}, {id: 423423, name: "Homer Simpson"}] } } */
    });

    monday.listen(['context'], res => {
      setContext(res.data);
      console.log(res.data);
      monday.api(`query ($boardIds: [Int]) { boards (ids:$boardIds) { name items(limit:10) { name column_values { title text } } } }`,
        { variables: {boardIds: context.boardIds} }
      )
      .then(res => {
        setBoardData(res.data) // res.data);
        setItemData(res.data.boards.find(b => b.name === "Saras Test Workspace").items) 
      });
    })

    const callback = res => setSettings(res);
    monday.listen(['settings'], callback);

  }, [])

  return (

    <div className="App">
      {/* <AttentionBox
        title="Hello Monday Apps!"
        text="Let's start building your amazing app, which will change the world!"
        type="success"
      /> */}

      {/* <ParentSize>{({ width, height }) => <Example width={500} height={300} />}</ParentSize> */}
      <Example width={500} height={300} />

      { itemData && 
        <TaskItem itemData={itemData} name="MyName" columnValues={{status: "Great"}}/>
      }
      {/* {
        JSON.stringify(this.state.settings)
      } */}
      {/* {JSON.stringify(boardData, null, 2)} */}
      {/* {JSON.stringify(itemData, null, 2)} */}
      
    </div>


  )

}


export default FunctionApp;
