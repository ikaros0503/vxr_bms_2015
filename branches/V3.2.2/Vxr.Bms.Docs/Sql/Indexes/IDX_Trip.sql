USE [VXR_BMS_003]
GO

ALTER TABLE [dbo].[Trip]
ALTER COLUMN [Keywords] [nvarchar](256) NULL

ALTER TABLE [dbo].[Trip]
ALTER COLUMN [IsPrgUnsignKeywords] [nvarchar](256) NULL

CREATE NONCLUSTERED INDEX [IDX_Trip] ON [dbo].[Trip]
(
	[CompId] ASC,
	[IsPrgStatus] ASC,
	[Type] ASC,
	[Date] DESC,
	[Time] ASC,
	[FromArea] ASC, 
	[ToArea] ASC,
	[Keywords] ASC,
	[IsPrgUnsignKeywords] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
GO
