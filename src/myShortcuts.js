/**
 * Created by nishkarshsharma on 17/09/14.
 */

    var editingActive=false;
    var oldLabel;


    function editLabel() {
        if(!editingActive) {
            editingActive = true;
            var label=st.labels.getLabel(selectedNode.id);
            oldLabel=label.innerHTML;
            label.innerHTML = "<input type=text style='border:0px;' id=nodeLabel value='"+selectedNode.name+"'>";
            $jit.id("nodeLabel").select();
        }
    }

    //edit label of selected node on pressing space bar
    shortcut.add("Space",function() {
        editLabel();
    },{
        'type':'keydown',
        'propagate':true,
        'target':document
    });


    //cancel editing changes on pressing ESC
    shortcut.add("Esc",function() {
        if(editingActive) {
            var label=st.labels.getLabel(selectedNode.id);
            label.innerHTML = oldLabel;
            editingActive=false;
        }
    },{
        'type':'keydown',
        'propagate':true,
        'target':document
    });

    //save new changes on editing on pressing enter
    shortcut.add("Enter",function() {
        if(editingActive) {
            var newLabel = $jit.id("nodeLabel").value;
            changeLabel(selectedNode,newLabel);
            editingActive=false;
        }
    },{
        'type':'keydown',
        'propagate':true,
        'target':document
    });

    shortcut.add("Right",function() {
        if(selectedNode.data.$orn=="right") {
            var firstParent = selectedNode.getParents()[0];
            st.select(firstParent.id);
            selectedNode = firstParent;
        }
        else if(selectedNode.data.$orn=="left") {
            var firstChild = selectedNode.getSubnodes()[1];
            st.select(firstChild.id);
            selectedNode = firstChild;
        }
        else {
            //The code below is just for selecting nodes on right(left) when
            //the root node is selected
            var found_first=false; //found the first node with $orn=left?
            var nextNode; //next to be selected node

            //go through each 'just' subnode and select the first one with
            //$orn as right
            selectedNode.eachSubnode(function(node) {
                if(node.data.$orn=='left' && found_first==false){
                    found_first=true;
                    st.select(node.id);
                    selectedNode=node;
                }
            });
        }
    },{
        'type':'keydown',
        'propagate':true,
        'target':document
    });

    shortcut.add("Left",function() {
        if(selectedNode.data.$orn=="left") {
            var firstParent = selectedNode.getParents()[0];
            st.select(firstParent.id);
            selectedNode = firstParent;
        }
        else if(selectedNode.data.$orn=="right") {
            var firstChild = selectedNode.getSubnodes()[1];
            st.select(firstChild.id);
            selectedNode = firstChild;
        }
        else {
            //The code below is just for selecting nodes on left(right) when
            //the root node is selected
            var found_first=false; //found the first node with $orn=right?
            var nextNode; //next to be selected node

            //go through each 'just' subnode and select the first one with
            //$orn as right
            selectedNode.eachSubnode(function(node) {
               if(node.data.$orn=='right' && found_first==false){
                  found_first=true;
                  st.select(node.id);
                  selectedNode=node;
               }
            });
        }
    },{
        'type':'keydown',
        'propagate':true,
        'target':document
    });

    shortcut.add("Down",function() {
        var thisNode=false;
        var nextNode;
        selectedNode.getParents()[0].eachSubnode(function(node){
            if(thisNode==true && node.data.$orn==selectedNode.data.$orn) {
                nextNode=node;
                st.select(nextNode.id);
                selectedNode=nextNode;
                thisNode=false;
                return;
            }
            if(node.id==selectedNode.id) {
                thisNode=true;
            }
        });
    });

    shortcut.add("Up",function() {
        var thisNode=false;
        var nextNode=selectedNode;
        selectedNode.getParents()[0].eachSubnode(function(node){
            if(node.id==selectedNode.id) {
                thisNode=true;
            }
            if(thisNode==true) {
                st.select(nextNode.id);
                selectedNode=nextNode;
                thisNode=false;
                return;
            }
            if(node.data.$orn==selectedNode.data.$orn)
                nextNode=node;
        });
    });

    shortcut.add("Tab",function() {
        var orn=selectedNode.data.$orn;
        var nodeNum=1;
        var noder=0;
        var nodel=0;
        selectedNode.eachSubnode(function (node) {
                nodeNum++;
                if(orn==undefined) {
                    if (node.data.$orn == 'left') {
                        nodel++;
                    }
                    else {
                        noder++;
                    }
                }
            });
        if(orn==undefined) {
            if (nodel >= noder) {
                orn = "right";
            }
            else {
                orn = "left";
            }
        }
        var node = {id:selectedNode.id+"."+nodeNum, name:"New Node", data:{"$orn":orn}};
        //Create Nodes -- connect them to main node for now
        st.graph.addNode(node);
        st.graph.addAdjacence(selectedNode,node);
        st.plot();
        st.refresh();
        //Work Around!! The easy simple straightforward way didnt select the node
        //for editing the name of the new node
        selectedNode.eachSubnode(function(node){st.select(node.id);selectedNode=node;});
        editLabel();
    },{
        'type':'keydown',
        'propagate':false,
        'target':document
    });

    shortcut.add("Ctrl+D",function() {
        st.removeSubtree(selectedNode.id, true, 'animate'); //removes the node and its sub nodes
        selectedNode=selectedNode.getParents()[0];  //Selects the immediate parent
    },{
        'type':'keydown',
        'propagate':false,
        'target':document
    });

    shortcut.add("Ctrl+S",function() {
        updateJSON(st);
    });

    shortcut.add("Shift+Left",function() {
        if(selectedNode.getParents()[0].id==st.root) {
            selectedNode.data.$orn="right";
            selectedNode.eachSubgraph(function(node){
               node.data.$orn="right";
            });
        }
        else if(selectedNode.data.$orn=="left"){
            var parent=selectedNode.getParents()[0];
            var grandParent=selectedNode.getParents()[0].getParents()[0];
            st.graph.removeAdjacence(selectedNode.id,parent.id);
            st.graph.addAdjacence(selectedNode,grandParent);
            st.plot();
            st.refresh();
        }
        updateJSON(st);
        st.refresh();
    },{
            'type':'keydown',
            'propagate':false,
            'target':document
    });

    shortcut.add("Shift+Right",function() {
        if(selectedNode.getParents()[0].id==st.root) {
            selectedNode.data.$orn="left";
            selectedNode.eachSubgraph(function(node){
                node.data.$orn="left";
            });
        }
        else if(selectedNode.data.$orn=="right") {
            var parent=selectedNode.getParents()[0];
            var grandParent=selectedNode.getParents()[0].getParents()[0];
            st.graph.removeAdjacence(selectedNode.id,parent.id);
            st.graph.addAdjacence(selectedNode,grandParent);
            st.plot();
            st.refresh();
        }
        updateJSON(st);
        st.refresh();
    },{
        'type':'keydown',
        'propagate':false,
        'target':document
    });