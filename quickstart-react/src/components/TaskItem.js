import React from "react";

const TaskItem = (props) => {

    const {status} = props.columnValues
   // const {name, columnValues} = props.itemdata

   // props.itemData.boards[0].items

    return (
        <div>
            <h3>Task Items</h3>
            <>
            {
                props.itemData.map(item => {
                    let column_values = item.column_values
                    //console.log(column_values)
                    let status = column_values.find(c => c.title === "Status")
                    let person = column_values.find(c => c.title === "Person")
                    let details = column_values.find(c => c.title === "Details")
                     

                    return (
                    <div style={{margin: 10, padding: 10, backgroundColor: 'gray', borderRadius: 5}}> 
                        <p>Name: {item.name}</p>
                        { status && <p>Status: {status.text}</p> }
                        { person && <p>Person: {person.text}</p> }
                        { details && <p>Details: {details.text}</p> }

                        <p> {JSON.stringify(column_values)} </p>
                    </div>
                    )
                })
            }

            {/* {JSON.stringify(props.itemData)} */}
            
            </>
        </div>
    )

}

export default TaskItem