namespace Vxr.Bms.Report
{
    public class Task : ITreeNodeAware<Task>
    {
        private TreeNode<Task> _Node;
        public bool Complete = false;

        public void MarkComplete()
        {
            foreach (TreeNode<Task> node in this.Node.Children)
            {
                node.Value.MarkComplete();
            }
            this.Complete = true;
        }

        public TreeNode<Task> Node
        {
            get
            {
                return this._Node;
            }
            set
            {
                this._Node = value;
            }
        }
    }
}

