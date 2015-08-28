namespace Vxr.Bms.Queue
{
    partial class ProjectInstaller
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary> 
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Component Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.BmsQueueProcessInstaller = new System.ServiceProcess.ServiceProcessInstaller();
            this.BmsQueueInstaller = new System.ServiceProcess.ServiceInstaller();
            // 
            // BmsQueueProcessInstaller
            // 
            this.BmsQueueProcessInstaller.Account = System.ServiceProcess.ServiceAccount.LocalSystem;
            this.BmsQueueProcessInstaller.Password = null;
            this.BmsQueueProcessInstaller.Username = null;
            // 
            // BmsQueueInstaller
            // 
            this.BmsQueueInstaller.Description = "Receiver Queue Service";
            this.BmsQueueInstaller.DisplayName = "Vxr.Bms.Queue";
            this.BmsQueueInstaller.ServiceName = "Receiver";
            this.BmsQueueInstaller.StartType = System.ServiceProcess.ServiceStartMode.Automatic;
            // 
            // ProjectInstaller
            // 
            this.Installers.AddRange(new System.Configuration.Install.Installer[] {
            this.BmsQueueProcessInstaller,
            this.BmsQueueInstaller});

        }

        #endregion

        private System.ServiceProcess.ServiceProcessInstaller BmsQueueProcessInstaller;
        private System.ServiceProcess.ServiceInstaller BmsQueueInstaller;
    }
}