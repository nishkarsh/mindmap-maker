mindmap-maker
=============

This is a web application that will allow creation of mind maps with the following features -
-provides a GUI with which user may interact to navigate and select nodes.
-provides simple keyboard shortcuts to do various operations on mindmap.
-provides a simple text2json parser so the user has to just write simple text separated by tabs to create mindmaps.
-the user may add image or icon, links to the nodes.

thejit - Javascript infovis Toolkit library has been used for visualization.


*The space tree has been used as a visualization and its a multitree.

keyboard shortcuts
--------------------
CTRL+D = Delete a subtree along with its children

SPACE = Edits the label of the node

TAB = Adds a new child

SHIFT + <- = Shifts a subtree to the left of root if it is a 'just child' of root or shift the subtree to left to make it the sibling of it's parent 

SHIFT + -> = just opposite of above

CTRL+S = saves the current mind map to update the json shown in the text area

