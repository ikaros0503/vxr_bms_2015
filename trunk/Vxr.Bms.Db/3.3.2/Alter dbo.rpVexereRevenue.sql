USE [VXR_BMS_BETA]
GO

/****** Object: SqlProcedure [dbo].[rpVexereRevenue] Script Date: 12-Aug-15 12:02:18 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[rpVexereRevenue]
	@where varchar(max),
	@strOrderBy varchar(max)
AS
BEGIN
DECLARE @sql nvarchar(max) = 
					  N'select 
            (case when (UserCharge like N''%.vxr'' or UserCharge like N''%.vexere'' or UserCharge like N''%.lovabus'') then N''Vexere'' else N''Khác'' end) as PaymentType,
            TripIdName, CustomerPhone, 
            TripDate as DepartureDate,
            case when Code is not null then Code else ''-'' end as TicketCode,
            SUBSTRING(SeatCode, 0, CHARINDEX(''|'', SeatCode)) as SeatCode,
            Total as TotalMoney 
            from XIKE_Ticket04'+' where '+  @where + @strOrderBy
EXEC(@sql)
END
