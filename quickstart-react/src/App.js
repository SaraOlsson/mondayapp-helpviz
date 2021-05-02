import React, { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css"
//Explore more Monday React Components here: https://style.monday.com/
import AttentionBox from "monday-ui-react-core/dist/AttentionBox.js"
import Dialog from "monday-ui-react-core/dist/Dialog.js"
import TextField from "monday-ui-react-core/dist/TextField.js"
import Button from "monday-ui-react-core/dist/Button.js"
import TaskItem from './components/TaskItem'
import SearchTest from './components/SearchTest'
import MondayProgressBar from './components/MondayProgressBar'
//import Example from './components/Example'
import ItemTree from './components/ItemTree'
import ParentSize from '@visx/responsive/lib/components/ParentSize'

import Alert from "monday-ui-style/src/Icons/Alert.svg"


import colors from "monday-ui-react-core/dist/assets/colors.json"
import { convertToObject } from "typescript";
// eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjEwNjkwNDkzMywidWlkIjoyMTQ5MzM0NiwiaWFkIjoiMjAyMS0wNC0xOFQxNjo0OTowMS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6ODc0MDQ2MCwicmduIjoidXNlMSJ9.Oyt8EWoDC0ieUQyskpVTkYyWRSO3EYned4tXFSMnMEA

const monday = mondaySdk(
  {
    clientId: 'fbd2b4802317e8712e7a30007c9d67a8',
    apiToken: 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjEwNjkwNDkzMywidWlkIjoyMTQ5MzM0NiwiaWFkIjoiMjAyMS0wNC0xOFQxNjo0OTowMS42MDNaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6ODc0MDQ2MCwicmduIjoidXNlMSJ9.2dXiR-AnZI3mTwo1w8Z219DCzoTbC4gErvSsfLKC7O8'
  }
);

const App = () => {

  const [context, setContext] = useState(undefined)
  const [settings, setSettings] = useState({})
  const [boardData, setBoardData] = useState({})
  const [itemData, setItemData] = useState(undefined)
  const [boardIds, setBoardIds] = useState([])
  const [perUserTree, setPerUserTree] = useState({})

  const [linkType, setLinkType] = useState('diagonal');
  const [warningAtCount, setWarningAtCount] = useState(2);

  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [activeEdit, setActiveEdit] = useState(undefined);
  const [updateText, setUpdateText] = useState("");

  useEffect(() => {

    monday.api(`query { me { name id } }`).then(res => {
      console.log(res);
      /* { data: { users: [{id: 12312, name: "Bart Simpson"}, {id: 423423, name: "Homer Simpson"}] } } */
    });

    // WORKS in Monday view
    monday.listen(['context'], res => {
      setContext(res.data);

      monday.api(`query ($boardIds: [Int]) { boards (ids:$boardIds) { name id items(limit:10) { name column_values { title text value} } } }`,
        { variables: {boardIds: context.boardIds} }
      )
      .then(res => {
        const data = res.data
        setBoardData(res)
        // const items = res.data.boards.find(b => b.name === "Saras Test Workspace").items
        const items = res.data.boards.find(b => b.name === "Flow Board").items
        setItemData(items) 

        // Group by users instead
        let grouped = [];
        let created = Object.create(null)

        items.forEach(function (a) {
            let person = a.column_values.find(c => c.title === "Person").text
            this[person] || grouped.push(this[person] = []);
            this[person].push(a);
        }, created);

        console.log(grouped);
        console.log(created);
        setPerUserTree(created)

      });
    })

    // WORKS in local dev
    monday.api(`query ($boardIds: [Int]) { boards (ids:$boardIds) { name id items(limit:10) { name id column_values { title text value} } } }`,
        { variables: {boardIds: [1246771577]} } //  // 1212645165
      )
      .then(res => {
        const data = res.data
        setBoardData(data)

        const items = res.data.boards.find(b => b.name === "Flow Board").items
        setItemData(items) 
        console.log(items)

        let grouped = []; // not used
        let created = Object.create(null)

        items.forEach(function (a) {
            let person = a.column_values.find(c => c.title === "Person").text
            this[person] || grouped.push(this[person] = []);
            this[person].push(a);
        }, created);

        setPerUserTree(created)

    });

    const callback = res => {
      setSettings(res);
      const linkstyle = res.data.linkstyle;
      setLinkType(linkstyle)
      setWarningAtCount(res.data.warningatcount);
    }
    monday.listen(['settings'], callback);

  }, [])

  
  const generateTreeNode = (items, key = 'User') => {

    let newTree = {
      name: key,
      children: []
    }

    items.map(i => {

      let status = i.column_values.find(c => c.title === "Status").text

      newTree.children.push({
        name: i.name,
        status: status,
        children: [],
        item: i
      })
    })

    return newTree 
  }

  const onNodeClick = (node) => {
    let {data, parent} = node // node = TREE ndode
    let createdBy = parent.data.name;
    // console.log(node)

    setOpenItemDialog(true)
    setActiveEdit({item: data.item, createdBy: createdBy})
  }

  const createItemUpdate = () => {

    let item_id = activeEdit.item.id

    console.log(`is 1212645172? ${item_id}`)
    console.log(`send update: ${updateText}`)
    let update_text = "Jonas can help you" // updateText.toString()

    monday.api(`
      mutation {
        create_update(
          item_id: ${item_id}, 
          body: "Jonas can help you"
        ) {
          id
        }
      }
    `).then(res => {
      console.log(res)
      setOpenItemDialog(false)
      setUpdateText("")
    });

  }

  // TODO: pick what status to change to
  // TODO: not dummy boardid
  const changeColumn = () => {

    monday.api(`
      mutation {
        change_simple_column_value (
          board_id: 1246771577, 
          item_id: ${activeEdit.item.id}, 
          column_id: "status", 
          value: "Flow"
        ) {
          id
        }
      }
    `).then(res => {

      console.log(res)

    });

    
  }

  const columnValue = (item, attr) => {
    return item.column_values.find(c => c.title === attr).text
  }

  const itemsAreMine = (userItems) => {
    let isMine = false
    if(context)
    {
      let myId = context.user.id
      let firstItem = userItems[0] 
      let personValue = firstItem.column_values.find(c => c.title === "Person").value
      let itemUserID = personValue ? JSON.parse(personValue).personsAndTeams[0].id : "noUserData"
      isMine = parseInt(itemUserID) === parseInt(myId)
    }
    return isMine
  }

  return (

    <div className="App">

      <div className="mainFlex">

        

        { (openItemDialog && activeEdit) &&
          <div className="editContainer" >
            <p className="textWorkingOn">
              {activeEdit.createdBy} is working on
            </p>
            <p className="textItemName"> 
                <span>{activeEdit.item.name}</span>
            </p>
            {/* <p><i>{activeEdit.item.name}</i></p> */}
            

            <p>
              {/* <i>{activeEdit.item.column_values.find(c => c.title === "Details").text}</i> */}
              <b>Details: </b>
              <i>{columnValue(activeEdit.item, "Details")}</i>
            </p>

            { itemsAreMine([activeEdit.item]) && 
            <>
            <Button marginLeft marginRight
              onClick={() => changeColumn()}
              color={"positive"}
            >
              Change status
            </Button>
            <br/><br/>
            </>
            }

            <TextField
            value={updateText}
            color=""
            fill="white"
            placeholder="Enter message"
            onChange={(text) => setUpdateText(text)}
            style={{backgroundColor: "white"}}
            />
            <br/>

            <Button marginLeft marginRight
              onClick={() => createItemUpdate()}
              color={"positive"}
            >
              Send update
            </Button>

            <Button marginLeft marginRight
              onClick={() => setOpenItemDialog(false)}
              color={"negative"}
            >
              Close
            </Button>

          </div>
        }

          
        {
          Object.keys(perUserTree).map(function(key, idx) {

            const numOngoing = perUserTree[key].length
            // let userId = "unknown"
            // let myId = "unknown2"
            let isMine = itemsAreMine(perUserTree[key])
            let ifIsme = isMine ? "(Me)" : ""
            
            if(!key) // only return items with Person assigned
              return null

            return (
            <div key={idx}>
              <div className="blockquote">
              <h3 className="userHeader">{key} {ifIsme} </h3>
              <p className="summaryText"> 
                <b>Summary:</b> {numOngoing} ongoing {numOngoing > 1 ? "items" : "item"}
              </p>
              { (numOngoing >= warningAtCount) &&
                <div className="alertRow">
                  <span className="iconCirle"><img src={Alert} alt="icon" width={30}/></span>
                  <span className="warningText">High workload</span>
                </div>
              }
              </div>
              
              <ItemTree width={500} height={200} 
              data={generateTreeNode(perUserTree[key], key)}
              linkType={linkType}
              onNodeClick={onNodeClick}/>
            </div>
            )
          })
        }

      </div>
    </div>
  )
}

export default App;

// JSON.stringify(colors)
// const StoryDialogContent = () => {
//   return (
//     <section className="story-dialog-content">
//       <h1>I am a dialog content</h1>
//     </section>
//   );
// };

/* <Dialog
  animationType="expand"
  position={"bottom"}
  shouldShowOnMount={true}
  content={<StoryDialogContent />}/> */

  /* <AttentionBox
  title="Hello Monday Apps!"
  text="Let's start building your amazing app, which will change the world!"
  type="success"
/> */


/* <MondayProgressBar/>
<SearchTest/> */

/* { itemData && 
  <TaskItem itemData={itemData} name="MyName" columnValues={{status: "Great"}}/>
} */

/* {
  JSON.stringify(settings)
} */
/* {
  colors["american_gray"]
} */
/* <p>Board data</p> <br/><br/>
{JSON.stringify(boardData, null, 2)}
<p>Context</p> <br/><br/> */
/* {JSON.stringify(itemData, null, 2)} */
/* {JSON.stringify(context)} */