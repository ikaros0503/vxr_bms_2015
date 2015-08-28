using System.Collections.Generic;

namespace Vxr.Bms.Report
{
    public class TreeNodeList<T> : List<TreeNode<T>>
    {
        public TreeNode<T> Parent;

        public TreeNodeList(TreeNode<T> Parent)
        {
            this.Parent = Parent;
        }

        public TreeNode<T> Add(TreeNode<T> Node)
        {
            base.Add(Node);
            Node.Parent = this.Parent;
            return Node;
        }

        public TreeNode<T> Add(T Value)
        {
            return this.Add(new TreeNode<T>(Value));
        }

        public override string ToString()
        {
            return ("Count=" + base.Count.ToString());
        }
    }
}

