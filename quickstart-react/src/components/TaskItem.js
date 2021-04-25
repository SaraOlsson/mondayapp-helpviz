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
                    return (
                    <div style={{margin: 10, padding: 10, backgroundColor: 'gray', borderRadius: 5}}> 
                        <p>Name: {item.name}</p>
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