import React from "react";
import LinearProgressBar from "monday-ui-react-core/dist/LinearProgressBar.js"

const MondayProgressBar = (props) => {

    return (
      <div style={{ width: "50%", margin: "40px" }}>
      <LinearProgressBar
        value={50}
        animated={true}
        valueSecondary={60}
        max={100}
        min={0}
        size={Object.values(LinearProgressBar.sizes)}
        barStyle={LinearProgressBar.styles.PRIMARY}
        indicateProgress={true}
        className={["linear-progress-bar--custom-class", ""]}
        ariaLabel={"my awesome growth bar"}
      />
    </div>
      );

}

export default MondayProgressBar