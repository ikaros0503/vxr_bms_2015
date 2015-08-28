using System;

namespace Vxr.Bms.Report
{
    public class TreeNode<T> : IDisposable
    {
        private TreeNodeList<T> _Children;
        private TreeTraversalType _DisposeTraversal;
        private bool _IsDisposed;
        private TreeNode<T> _Parent;
        private T _Value;

        public event EventHandler Disposing;

        public TreeNode()
        {
            this._DisposeTraversal = TreeTraversalType.BottomUp;
            this.Parent = null;
        }

        public TreeNode(T Value)
        {
            this._DisposeTraversal = TreeTraversalType.BottomUp;
            this.Value = Value;
            this.Parent = null;
            this.Children = new TreeNodeList<T>((TreeNode<T>) this);
        }

        public TreeNode(T Value, TreeNode<T> Parent)
        {
            this._DisposeTraversal = TreeTraversalType.BottomUp;
            this.Value = Value;
            this.Parent = Parent;
            this.Children = new TreeNodeList<T>((TreeNode<T>) this);
        }

        public void CheckDisposed()
        {
            if (this.IsDisposed)
            {
                throw new ObjectDisposedException(base.GetType().Name);
            }
        }

        public void Dispose()
        {
            this.CheckDisposed();
            this.OnDisposing();
            if (this.Value is IDisposable)
            {
                if (this.DisposeTraversal == TreeTraversalType.BottomUp)
                {
                    foreach (TreeNode<T> node in this.Children)
                    {
                        node.Dispose();
                    }
                }
                (this.Value as IDisposable).Dispose();
                if (this.DisposeTraversal == TreeTraversalType.TopDown)
                {
                    foreach (TreeNode<T> node in this.Children)
                    {
                        node.Dispose();
                    }
                }
            }
            this._IsDisposed = true;
        }

        protected void OnDisposing()
        {
            if (this.Disposing != null)
            {
                this.Disposing(this, EventArgs.Empty);
            }
        }

        public TreeNodeList<T> Children
        {
            get
            {
                return this._Children;
            }
            private set
            {
                this._Children = value;
            }
        }

        public int Depth
        {
            get
            {
                int num = 0;
                TreeNode<T> parent = this;
                while (parent.Parent != null)
                {
                    parent = parent.Parent;
                    num++;
                }
                return num;
            }
        }

        public TreeTraversalType DisposeTraversal
        {
            get
            {
                return this._DisposeTraversal;
            }
            set
            {
                this._DisposeTraversal = value;
            }
        }

        public bool IsDisposed
        {
            get
            {
                return this._IsDisposed;
            }
        }

        public TreeNode<T> Parent
        {
            get
            {
                return this._Parent;
            }
            set
            {
                if (value != this._Parent)
                {
                    if (this._Parent != null)
                    {
                        this._Parent.Children.Remove((TreeNode<T>) this);
                    }
                    if (!((value == null) || value.Children.Contains((TreeNode<T>) this)))
                    {
                        value.Children.Add((TreeNode<T>) this);
                    }
                    this._Parent = value;
                }
            }
        }

        public TreeNode<T> Root
        {
            get
            {
                TreeNode<T> parent = this;
                while (parent.Parent != null)
                {
                    parent = parent.Parent;
                }
                return parent;
            }
        }

        public T Value
        {
            get
            {
                return this._Value;
            }
            set
            {
                this._Value = value;
                if ((this._Value != null) && (this._Value is ITreeNodeAware<T>))
                {
                    (this._Value as ITreeNodeAware<T>).Node = (TreeNode<T>) this;
                }
            }
        }

        public enum TreeTraversalType
        {
            BottomUp,
            TopDown
        }
    }
}



