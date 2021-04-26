import React, { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css"
//Explore more Monday React Components here: https://style.monday.com/
import AttentionBox from "monday-ui-react-core/dist/AttentionBox.js"
import TaskItem from './components/TaskItem'
import SearchTest from './components/SearchTest'
import MondayProgressBar from './components/MondayProgressBar'
//import Example from './components/Example'
import ItemTree from './components/ItemTree'


import colors from "monday-ui-react-core/dist/assets/colors.json"


const monday = mondaySdk(
  {
    clientId: 'fbd2b4802317e8712e7a30007c9d67a8',
    apiToken: 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjEwNjkwNDkzMywidWlkIjoyMTQ5MzM0NiwiaWFkIjoiMjAyMS0wNC0xOFQxNjo0OTowMS42MDNaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6ODc0MDQ2MCwicmduIjoidXNlMSJ9.2dXiR-AnZI3mTwo1w8Z219DCzoTbC4gErvSsfLKC7O8'
  }
);

const App = () => {

  const [context, setContext] = useState({})
  const [settings, setSettings] = useState({})
  const [boardData, setBoardData] = useState({})
  const [itemData, setItemData] = useState(undefined)
  const [boardIds, setBoardIds] = useState([])
  const [tree, setTree] = useState({})

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
        const items = res.data.boards.find(b => b.name === "Saras Test Workspace").items
        setItemData(items) 
        generateTreeNode(items)
      });
    })

    const callback = res => setSettings(res);
    monday.listen(['settings'], callback);

  }, [])

  
  const generateTreeNode = (items) => {

    let newTree = {
      name: 'Base',
      children: []
    }

    items.map(i => {

      let status = i.column_values.find(c => c.title === "Status").text

      newTree.children.push({
        name: i.name,
        status: status,
        children: []
      })
    })

    // newTree.children.push(
    //   {
    //     name: 'Children 1',
    //     children: []
    //   }
    // )

    // newTree.children.push(
    //   {
    //     name: 'Children 2',
    //     children: []
    //   }
    // )

    setTree(newTree)

    // return {
    //   name: 'YAY!',
    //   children: [
    //     {
    //       name: 'Default Data!',
    //       children: [
    //         { name: 'A1' },
    //         { name: 'A2' },
    //         { name: 'A3' }
    //       ],
    //     },
    //     { name: 'Z' },
    //     {
    //       name: 'B',
    //       children: [{ name: 'B1' }, { name: 'B2' }, { name: 'B3' }],
    //     },
    //   ],
    // }
  }

  return (

    <div className="App">
      {/* <AttentionBox
        title="Hello Monday Apps!"
        text="Let's start building your amazing app, which will change the world!"
        type="success"
      /> */}

      {/* <MondayProgressBar/>
      <SearchTest/> */}

      <div className="mainFlex">

      {/* <ParentSize>{({ width, height }) => <Example width={500} height={300} />}</ParentSize> */}
      {/* <Example width={500} height={300} /> */}
      <ItemTree width={1000} height={300} data={tree}/>

      { itemData && 
        <TaskItem itemData={itemData} name="MyName" columnValues={{status: "Great"}}/>
      }
      {/* {
        JSON.stringify(this.state.settings)
      } */}
      {
        colors["american_gray"]
      }
      {/* {JSON.stringify(boardData, null, 2)} */}
      {/* {JSON.stringify(itemData, null, 2)} */}

      </div>
      
    </div>


  )

}

//         JSON.stringify(colors)
export default App;
