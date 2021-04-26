import React from "react";
import Search from "monday-ui-react-core/dist/Search.js"

const TaskItem = (props) => {

    return (
        <>
          <div style={{ width: "35%", margin: "0 auto" }}>
            <Search
              inputAriaLabel={"Search for content"}
              autoFocus={true}
              placeholder={"default placeholder"}
              debounceRate={0}
              onChange={value => console.log(value)}
              value={""}
              iconName={"fa-search"}
              secondaryIconName="fa-close"
              validation={{
                None: null,
                Error: { status: "error" },
                Success: { status: "success" }
              }}
              id="Knobs"
              clearOnIconClick={true}
              disabled={false}
              size={{ ...Object.values(Search.sizes) }}
            />
          </div>
        </>
      );

}

export default TaskItem