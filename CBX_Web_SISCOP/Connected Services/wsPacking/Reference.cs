﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace CBX_Web_SISCOP.wsPacking {
    using System.Runtime.Serialization;
    using System;
    
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Runtime.Serialization", "4.0.0.0")]
    [System.Runtime.Serialization.DataContractAttribute(Name="MaestroCaracteres", Namespace="http://schemas.datacontract.org/2004/07/Dominio.Entidades")]
    [System.SerializableAttribute()]
    public partial class MaestroCaracteres : object, System.Runtime.Serialization.IExtensibleDataObject, System.ComponentModel.INotifyPropertyChanged {
        
        [System.NonSerializedAttribute()]
        private System.Runtime.Serialization.ExtensionDataObject extensionDataField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private int intMaxLengthField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string strColumnNameField;
        
        [global::System.ComponentModel.BrowsableAttribute(false)]
        public System.Runtime.Serialization.ExtensionDataObject ExtensionData {
            get {
                return this.extensionDataField;
            }
            set {
                this.extensionDataField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public int intMaxLength {
            get {
                return this.intMaxLengthField;
            }
            set {
                if ((this.intMaxLengthField.Equals(value) != true)) {
                    this.intMaxLengthField = value;
                    this.RaisePropertyChanged("intMaxLength");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string strColumnName {
            get {
                return this.strColumnNameField;
            }
            set {
                if ((object.ReferenceEquals(this.strColumnNameField, value) != true)) {
                    this.strColumnNameField = value;
                    this.RaisePropertyChanged("strColumnName");
                }
            }
        }
        
        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;
        
        protected void RaisePropertyChanged(string propertyName) {
            System.ComponentModel.PropertyChangedEventHandler propertyChanged = this.PropertyChanged;
            if ((propertyChanged != null)) {
                propertyChanged(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
            }
        }
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.ServiceContractAttribute(ConfigurationName="wsPacking.IPackingSrv")]
    public interface IPackingSrv {
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IPackingSrv/MaestroMaxCaracteres", ReplyAction="http://tempuri.org/IPackingSrv/MaestroMaxCaracteresResponse")]
        CBX_Web_SISCOP.wsPacking.MaestroCaracteres[] MaestroMaxCaracteres(string strTableName);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IPackingSrv/MaestroMaxCaracteres", ReplyAction="http://tempuri.org/IPackingSrv/MaestroMaxCaracteresResponse")]
        System.Threading.Tasks.Task<CBX_Web_SISCOP.wsPacking.MaestroCaracteres[]> MaestroMaxCaracteresAsync(string strTableName);
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public interface IPackingSrvChannel : CBX_Web_SISCOP.wsPacking.IPackingSrv, System.ServiceModel.IClientChannel {
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public partial class PackingSrvClient : System.ServiceModel.ClientBase<CBX_Web_SISCOP.wsPacking.IPackingSrv>, CBX_Web_SISCOP.wsPacking.IPackingSrv {
        
        public PackingSrvClient() {
        }
        
        public PackingSrvClient(string endpointConfigurationName) : 
                base(endpointConfigurationName) {
        }
        
        public PackingSrvClient(string endpointConfigurationName, string remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public PackingSrvClient(string endpointConfigurationName, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public PackingSrvClient(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(binding, remoteAddress) {
        }
        
        public CBX_Web_SISCOP.wsPacking.MaestroCaracteres[] MaestroMaxCaracteres(string strTableName) {
            return base.Channel.MaestroMaxCaracteres(strTableName);
        }
        
        public System.Threading.Tasks.Task<CBX_Web_SISCOP.wsPacking.MaestroCaracteres[]> MaestroMaxCaracteresAsync(string strTableName) {
            return base.Channel.MaestroMaxCaracteresAsync(strTableName);
        }
    }
}