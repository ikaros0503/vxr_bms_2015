alter table Account 
add RoleGroups nvarchar
Go

alter view zgcl_Account00 as
SELECT        dbo.Account.Id, dbo.Account.Type, dbo.Account.Code, dbo.Account.Name, dbo.Account.Note, dbo.Account.Username, dbo.Account.Password, dbo.Account.Role, dbo.Account.SessionInfo, 
                         dbo.Account.SessionHistoryInfo, dbo.Account.Info, dbo.Account.Keywords, dbo.Account.IsPrgStatus, dbo.Account.IsPrgPartComp, dbo.Account.IsPrgCreatedDate, dbo.Account.IsPrgUpdatedDate, 
                         dbo.Account.IsPrgCreatedUserId, dbo.Account.IsPrgUpdatedUserId, dbo.Account.IsPrgUnsignKeywords, dbo.Account.IsPrgLanguageInfo, dbo.Account.IsPrgHistoryInfo, dbo.Account.CompId, dbo.Account.PersonId, 
                         dbo.Account.AgentId, dbo.Account.RoleGroups AS CompIdType, dbo.Company.Type AS CompIdCode, dbo.Company.Code AS CompIdName, dbo.Company.Name AS CompIdFullName, 
                         dbo.Company.UIConfigInfo AS CompIdUIConfigInfo, RoleGroups
FROM            dbo.Account LEFT OUTER JOIN
                         dbo.Company ON dbo.Account.CompId = dbo.Company.Id
Go

Alter view zgcl_Account01 as
SELECT        dbo.zgcl_Account00.Id, dbo.zgcl_Account00.Type, dbo.zgcl_Account00.Code, dbo.zgcl_Account00.Name, dbo.zgcl_Account00.Note, dbo.zgcl_Account00.Username, dbo.zgcl_Account00.Password, 
                         dbo.zgcl_Account00.Role, dbo.zgcl_Account00.SessionInfo, dbo.zgcl_Account00.SessionHistoryInfo, dbo.zgcl_Account00.Info, dbo.zgcl_Account00.Keywords, dbo.zgcl_Account00.IsPrgStatus, 
                         dbo.zgcl_Account00.IsPrgPartComp, dbo.zgcl_Account00.IsPrgCreatedDate, dbo.zgcl_Account00.IsPrgUpdatedDate, dbo.zgcl_Account00.IsPrgCreatedUserId, dbo.zgcl_Account00.IsPrgUpdatedUserId, 
                         dbo.zgcl_Account00.IsPrgUnsignKeywords, dbo.zgcl_Account00.IsPrgLanguageInfo, dbo.zgcl_Account00.IsPrgHistoryInfo, dbo.zgcl_Account00.CompId, dbo.zgcl_Account00.PersonId, dbo.zgcl_Account00.AgentId, 
                         dbo.zgcl_Account00.CompIdType, dbo.zgcl_Account00.CompIdCode, dbo.zgcl_Account00.CompIdName, dbo.zgcl_Account00.CompIdFullName, dbo.zgcl_Account00.CompIdUIConfigInfo, 
                         dbo.zgcl_Account00.RoleGroups AS PersonIdType, dbo.Person.Type AS PersonIdCode, dbo.Person.Code AS PersonIdName, dbo.Person.Name AS PersonIdFullName, 
                         dbo.Person.UIConfigInfo AS PersonIdUIConfigInfo, RoleGroups
FROM            dbo.zgcl_Account00 LEFT OUTER JOIN
                         dbo.Person ON dbo.zgcl_Account00.PersonId = dbo.Person.Id
Go

alter view zgcl_Account02 as
SELECT        dbo.zgcl_Account01.Id, dbo.zgcl_Account01.Type, dbo.zgcl_Account01.Code, dbo.zgcl_Account01.Name, dbo.zgcl_Account01.Note, dbo.zgcl_Account01.Username, dbo.zgcl_Account01.Password, 
                         dbo.zgcl_Account01.Role, dbo.zgcl_Account01.SessionInfo, dbo.zgcl_Account01.SessionHistoryInfo, dbo.zgcl_Account01.Info, dbo.zgcl_Account01.Keywords, dbo.zgcl_Account01.IsPrgStatus, 
                         dbo.zgcl_Account01.IsPrgPartComp, dbo.zgcl_Account01.IsPrgCreatedDate, dbo.zgcl_Account01.IsPrgUpdatedDate, dbo.zgcl_Account01.IsPrgCreatedUserId, dbo.zgcl_Account01.IsPrgUpdatedUserId, 
                         dbo.zgcl_Account01.IsPrgUnsignKeywords, dbo.zgcl_Account01.IsPrgLanguageInfo, dbo.zgcl_Account01.IsPrgHistoryInfo, dbo.zgcl_Account01.CompId, dbo.zgcl_Account01.PersonId, dbo.zgcl_Account01.AgentId, 
                         dbo.zgcl_Account01.CompIdType, dbo.zgcl_Account01.CompIdCode, dbo.zgcl_Account01.CompIdName, dbo.zgcl_Account01.CompIdFullName, dbo.zgcl_Account01.CompIdUIConfigInfo, 
                         dbo.zgcl_Account01.PersonIdType, dbo.zgcl_Account01.PersonIdCode, dbo.zgcl_Account01.PersonIdName, dbo.zgcl_Account01.PersonIdFullName, dbo.zgcl_Account01.PersonIdUIConfigInfo, 
                         dbo.zgcl_Account01.RoleGroups AS AgentIdType, dbo.Company.Type AS AgentIdCode, dbo.Company.Code AS AgentIdName, dbo.Company.Name AS AgentIdFullName, 
                         dbo.Company.UIConfigInfo AS AgentIdUIConfigInfo, RoleGroups
FROM            dbo.Company RIGHT OUTER JOIN
                         dbo.zgcl_Account01 ON dbo.Company.Id = dbo.zgcl_Account01.AgentId
Go
select * from zgcl_Account02

/*disable trigger to excuse */
update Account set RoleGroups = CAST(Role as nvarchar)  Where Role<=5

select Type, Username, Role, RoleGroups from Account

