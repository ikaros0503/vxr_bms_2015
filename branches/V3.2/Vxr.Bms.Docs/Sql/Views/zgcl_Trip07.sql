USE [VXR_BMS_003]
GO

/****** Object:  View [dbo].[zgcl_Trip07]    Script Date: 16/06/2015 12:10:29 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



ALTER VIEW [dbo].[zgcl_Trip07]
AS
SELECT        dbo.zgcl_Trip06.Id, dbo.zgcl_Trip06.Type, dbo.zgcl_Trip06.Code, dbo.zgcl_Trip06.Name, dbo.zgcl_Trip06.Note, dbo.zgcl_Trip06.Alias, dbo.zgcl_Trip06.ToArea, dbo.zgcl_Trip06.Date, dbo.zgcl_Trip06.FromArea, 
                         dbo.zgcl_Trip06.Time, dbo.zgcl_Trip06.RouteInfo, dbo.zgcl_Trip06.FareInfo, dbo.zgcl_Trip06.Info, dbo.zgcl_Trip06.Keywords, dbo.zgcl_Trip06.IsPrgStatus, dbo.zgcl_Trip06.IsPrgUnsignKeywords, dbo.zgcl_Trip06.CompId, dbo.zgcl_Trip06.BaseId, dbo.zgcl_Trip06.FromId, 
                         dbo.zgcl_Trip06.ToId, dbo.zgcl_Trip06.NewFare, dbo.zgcl_Trip06.Discount, dbo.zgcl_Trip06.VxrFareInfo, dbo.zgcl_Trip06.VxrDiscount, dbo.zgcl_Trip06.DisplayOrder, dbo.zgcl_Trip06.VBookingConfig, 
                         dbo.zgcl_Trip06.VPaymentConfig, dbo.zgcl_Trip06.VAppConfig, dbo.zgcl_Trip06.CompIdName, dbo.zgcl_Trip06.HasOfflineContract, dbo.zgcl_Trip06.HasOnlineContract, dbo.zgcl_Trip06.HasBmsContract, zgcl_Trip06_Route.Type AS BType, zgcl_Trip06_Route.Code AS BCode, 
                         zgcl_Trip06_Route.Name AS BName, zgcl_Trip06_Route.FromArea AS BFromArea, zgcl_Trip06_Route.ToArea AS BToArea, zgcl_Trip06_Route.Date AS BDate, zgcl_Trip06_Route.Time AS BTime, 
                         zgcl_Trip06_Route.RouteInfo AS BRouteInfo, zgcl_Trip06_Route.FareInfo AS BFareInfo, zgcl_Trip06_Route.Info AS BInfo, zgcl_Trip06_Route.IsPrgStatus AS BIsPrgStatus, zgcl_Trip06_Route.BaseId AS BBaseId, 
                         zgcl_Trip06_Route.FromId AS BFromId, zgcl_Trip06_Route.ToId AS BToId, zgcl_Trip06_Route.NewFare AS BNewFare, zgcl_Trip06_Route.Discount AS BDiscount, zgcl_Trip06_Route.VxrFareInfo AS BVxrFareInfo, 
                         zgcl_Trip06_Route.VxrDiscount AS BVxrDiscount, zgcl_Trip06_Route.DisplayOrder AS BDisplayOrder, zgcl_Trip06_Route.VBookingConfig AS BVBookingConfig, 
                         zgcl_Trip06_Route.VPaymentConfig AS BVPaymentConfig, zgcl_Trip06_Route.VAppConfig as BVAppConfig, zgcl_Trip06_Route.HasOfflineContract AS BHasOfflineContract, zgcl_Trip06_Route.HasOnlineContract AS BHasOnlineContract, zgcl_Trip06_Route.HasBmsContract AS BHasBmsContract
FROM            dbo.zgcl_Trip06 LEFT OUTER JOIN
                         dbo.zgcl_Trip06 AS zgcl_Trip06_Route ON dbo.zgcl_Trip06.BaseId = zgcl_Trip06_Route.Id



GO


