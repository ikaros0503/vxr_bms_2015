namespace Vxr.Bms.Report
{
    public class Tree<T> : TreeNode<T>
    {
        public Tree()
        {
        }

        public Tree(T RootValue)
        {
            base.Value = RootValue;
        }
    }
}

