defenition:
panel types:
1. row - container with children in flex layout with flex direction of row;
2. column - container with children in flex layout with flex direction of column;
3. tabs - container with children which displayed as tabs. only one tab is active at the same time;
4. accordion - container displayed his children in accordion mode. direction can be horisontal or vertical;
5. content - panel without children and with the actual content;
6. float - float panel.
7. window - opened in a new browser window;

* Drop on Left/right/top/bottom snap - check if parent its a container on the same direction of the snap drop, if so put the item in the parent.
    if its on diffrent direction - create a new container- type:row/column and move the original conteainer + the moved item to the new container;
    if the parent is not a container but a content type, then create a new container and move them both to the new one;

order - place the moved item on the location it has been dropped in the same oreder.
cleanup- if the moved item left behind him a container with less than 1 children, move the last child to the grandpa and delete the empty panel.

* Drop on center - create a new tabs panel (or use the exist one) and move the original + moved panel to the tabs panel; 

* Drop on tabs header - as the same as drop on center + apply the right order;

* Tree drop zone component - will contain a snaps drop to group of panels. 