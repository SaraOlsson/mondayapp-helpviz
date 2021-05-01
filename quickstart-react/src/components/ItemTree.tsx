import React, { useEffect, useState } from 'react';
import { Group } from '@visx/group';
import { hierarchy, Tree } from '@visx/hierarchy';
import { LinearGradient } from '@visx/gradient';
import { pointRadial } from 'd3-shape';
import useForceUpdate from './useForceUpdate';
import LinkControls from './LinkControls';
import getLinkComponent from './getLinkComponent';

import colors from "monday-ui-react-core/dist/assets/colors.json"

interface TreeNode {
  name: string;
  status: string;
  isExpanded?: boolean;
  children?: TreeNode[];
}

const STATUS_RADIUS = 6

// const defaultData: TreeNode = {
//   name: 'Sara Olsson',
//   children: [
//     {
//       name: 'Default Data',
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
// };

const defaultMargin = { top: 30, left: 30, right: 230, bottom: 70 };

export type LinkTypesProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  data: TreeNode;
  linkType: string;
};

export default function ItemTree({
  width: totalWidth,
  height: totalHeight,
  margin = defaultMargin,
  data: data,
  linkType: linkType
}: LinkTypesProps) {
  const [layout, setLayout] = useState<string>('cartesian');
  const [orientation, setOrientation] = useState<string>('horizontal');
  // const [linkType, setLinkType] = useState<string>('diagonal');
  const [stepPercent, setStepPercent] = useState<number>(0.5);
  const forceUpdate = useForceUpdate();

  const innerWidth = totalWidth - margin.left - margin.right;
  const innerHeight = totalHeight - margin.top - margin.bottom;

  let origin: { x: number; y: number };
  let sizeWidth: number = innerHeight
  let sizeHeight: number = innerWidth
  origin = { x: 0, y: 0 };
  //sizeWidth = innerHeight;
  //sizeHeight = innerWidth;

  useEffect(() => {
    forceUpdate()
  }, [linkType])

  const LinkComponent = getLinkComponent({ layout, linkType, orientation });

  return totalWidth < 10 ? null : (
    <div className="myItemTree">
      <svg width={totalWidth} height={totalHeight}>
        <LinearGradient id="links-gradient" from="#fd9b93" to="#fe6e9e" />
        <rect width={totalWidth} height={totalHeight} rx={14} fill="#272b4d" />
        <Group top={margin.top} left={margin.left}>
          <Tree
            root={hierarchy(data, d => (d.isExpanded ? null : d.children))}
            size={[sizeWidth, sizeHeight]}
            separation={(a, b) => (a.parent === b.parent ? 1 : 0.5) / a.depth}
          >
            {tree => (
              <Group top={origin.y} left={origin.x}>
                {tree.links().map((link, i) => (
                  <LinkComponent
                    key={i}
                    data={link}
                    percent={stepPercent}
                    stroke="rgb(254,110,158,0.6)"
                    strokeWidth="1"
                    fill="none"
                  />
                ))}

                {tree.descendants().map((node, key) => {
                  let width = 40;
                  const height = 20;

                  if(node.data.name)
                    width = node.data.name.length*6;

                  let top: number = node.x;
                  let left: number = node.y;            

                  return (
                    <Group top={top} left={left} key={key}>
                      {node.depth === 0 && (
                        <circle
                          r={12}
                          fill="url('#links-gradient')"
                          onClick={() => {
                            node.data.isExpanded = !node.data.isExpanded;
                            console.log(node);
                            forceUpdate();
                          }}
                        />
                      )}
                      {node.depth !== 0 && (
                        <rect
                          height={height}
                          width={width}
                          y={-height / 2}
                          x={-width / 2}
                          fill="#272b4d"
                          stroke={node.data.children ? '#03c0dc' : '#26deb0'}
                          strokeWidth={1}
                          strokeDasharray={node.data.children ? '0' : '2,2'}
                          strokeOpacity={node.data.children ? 1 : 0.6}
                          rx={node.data.children ? 0 : 10}
                          onClick={() => {
                            node.data.isExpanded = !node.data.isExpanded;
                            console.log(node);
                            alert(`clicked: ${JSON.stringify(node.data.name)}`);
                            forceUpdate();
                          }}
                        />
                      )}
                      <text
                        dy=".33em"
                        fontSize={9}
                        fontFamily="Arial"
                        textAnchor="middle"
                        style={{ pointerEvents: 'none' }}
                        fill={node.depth === 0 ? '#71248e' : node.children ? 'white' : '#26deb0'}
                      >
                        {node.data.name}
                      </text>
                      {/* <div style={{width: 10, height: 10, borderRadius: 100, backgroundColor: 'pink'}}></div> */}
                      {node.depth > 0 &&
                      <circle
                          r={STATUS_RADIUS}
                          transform={"translate("+ ((STATUS_RADIUS*2)+(width/2)).toString() + ", 0)"}
                          fill={node.data.status === 'Flow' ? colors["success"] : colors["orange"]}
                          onClick={() => {
                            node.data.isExpanded = !node.data.isExpanded;
                            console.log(node);
                            forceUpdate();
                          }}
                        />
                      }
                    </Group>
                  );
                })}
              </Group>
            )}
          </Tree>
        </Group>
      </svg>
    </div>
  );
}

//                           fill="url('#links-gradient')"