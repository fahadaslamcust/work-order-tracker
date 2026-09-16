type	WorkOrderStatus	=	'open'	|	'in_progress'	|	'blocked'	|	'closed';
type	Priority	=	'low'	|	'medium'	|	'high';
interface	WorkOrder	{
id:	string;												
title:	string;									
description: string;			//	up	to	2000	chars,	may	be	empty
status:	WorkOrderStatus;
priority:	Priority;
assignee:	string	|	null;		//	username,	or	null	if	unassigned
createdAt:	string;					
updatedAt:	string;					
}