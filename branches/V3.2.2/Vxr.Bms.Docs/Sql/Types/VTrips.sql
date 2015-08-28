IF TYPE_ID('VTrips') IS NOT NULL
   BEGIN
     DROP TYPE VTrips
   END
GO  

CREATE TYPE VTrips AS TABLE
      (
	    [Id] [bigint] NOT NULL, 
		[Type] [int] NULL, 
		[Code] [nvarchar](512) NULL, 
		[Name] [nvarchar](256) NULL, 
		[Note] [nvarchar](max) NULL, 
		[Alias] [int] NULL, 
		[Date] [datetime] NULL, 
		[Time] [nvarchar](32) NULL, 
		[FromId] [bigint] NULL, 
		[ToId] [bigint] NULL, 
		[FromArea] [nvarchar](128) NULL, 
		[ToArea] [nvarchar](128) NULL, 
		[Info] [nvarchar](max) NULL, 
		[RouteInfo] [nvarchar](max) NULL,
		[MasterFare] [decimal] NULL,
		[FareInfo] [nvarchar](max) NULL,
		[VxrDiscount] int NULL,
		[VxrMasterFare] [decimal] NULL,
		[VxrFareInfo] [nvarchar](max) NULL,
		[VBookingConfig] [int] NULL,
		[BVBookingConfig] [int] NULL,
		[VBookingText] [nvarchar](max) NULL, 

		[VPaymentConfig] [int] NULL,
		[BVPaymentConfig] [int] NULL,
		[VPaymentText] [nvarchar](max) NULL, 

		[VAppConfig] [int] NULL,
		[BVAppConfig] [int] NULL,
		[VAppText] [nvarchar](max) NULL, 

		[HasOfflineContract] [bit] NULL,
		[HasOnlineContract] [bit] NULL,
		[HasBmsContract] [bit] NULL,
		[CompId] [bigint]  NOT NULL, 
		[CompIdName] [nvarchar](128) NULL,
		[IsPrgStatus] [int] NULL,
		[BaseId] [bigint] NULL,
		[SortCode] [bigint] NULL
		
	);
GO

--@cTripVAppConfig, @cTripBVAppConfig, @cTripVAppText
