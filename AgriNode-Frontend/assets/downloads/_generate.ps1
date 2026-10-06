$ErrorActionPreference = 'Stop'

$outDir = Split-Path -Parent $MyInvocation.MyCommand.Path

function Escape-Pdf {
  param([string]$Text)
  return $Text -replace '\\','\\' -replace '\(','\\(' -replace '\)','\\)'
}

function Write-PdfDocument {
  param(
    [string]$Path,
    [string]$Title,
    [string[]]$Lines
  )

  $left = 46
  $pageHeight = 842
  $titleSize = 18
  $headingSize = 12
  $bodySize = 9
  $lineHeight = 12
  $y = $pageHeight - 56

  $sb = [System.Text.StringBuilder]::new()
  $null = $sb.AppendLine('BT')
  $null = $sb.AppendLine("/F1 $titleSize Tf")
  $null = $sb.AppendLine("$left $y Td")
  $null = $sb.AppendLine("(" + (Escape-Pdf $Title) + ") Tj")
  $null = $sb.AppendLine('0 -20 Td')
  $null = $sb.AppendLine("/F1 $bodySize Tf")
  $null = $sb.AppendLine('(' + ('-' * 95) + ') Tj')
  $null = $sb.AppendLine('0 -14 Td')

  foreach ($line in $Lines) {
    if ($line.StartsWith('##')) {
      $null = $sb.AppendLine('0 -4 Td')
      $null = $sb.AppendLine("/F1 $headingSize Tf")
      $null = $sb.AppendLine("(" + (Escape-Pdf $line.Substring(2).Trim()) + ") Tj")
      $null = $sb.AppendLine("/F1 $bodySize Tf")
      $null = $sb.AppendLine('0 -14 Td')
      $y -= 18
      continue
    }

    if ($line -eq '---') {
      $null = $sb.AppendLine('(' + ('-' * 95) + ') Tj')
      $null = $sb.AppendLine("0 -$lineHeight Td")
      $y -= $lineHeight
      continue
    }

    if ($y -lt 68) { break }
    $safe = if ([string]::IsNullOrWhiteSpace($line)) { ' ' } else { Escape-Pdf $line }
    $null = $sb.AppendLine("($safe) Tj")
    $null = $sb.AppendLine("0 -$lineHeight Td")
    $y -= $lineHeight
  }

  $null = $sb.AppendLine('ET')
  $stream = $sb.ToString()
  $streamLength = [System.Text.Encoding]::ASCII.GetBytes($stream).Length

  $pdf = [System.Text.StringBuilder]::new()
  $offsets = New-Object int[] 5

  $null = $pdf.AppendLine('%PDF-1.4')
  $null = $pdf.AppendLine('%AgriNode Demo Assets')

  $offsets[0] = $pdf.Length
  $null = $pdf.Append("1 0 obj`n<< /Type /Catalog /Pages 2 0 R >>`nendobj`n")

  $offsets[1] = $pdf.Length
  $null = $pdf.Append("2 0 obj`n<< /Type /Pages /Kids [3 0 R] /Count 1 >>`nendobj`n")

  $offsets[2] = $pdf.Length
  $null = $pdf.Append("3 0 obj`n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>`nendobj`n")

  $offsets[3] = $pdf.Length
  $null = $pdf.Append("4 0 obj`n<< /Length $streamLength >>`nstream`n")
  $null = $pdf.Append($stream)
  $null = $pdf.Append("endstream`nendobj`n")

  $offsets[4] = $pdf.Length
  $null = $pdf.Append("5 0 obj`n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`nendobj`n")

  $xrefStart = $pdf.Length
  $null = $pdf.Append("xref`n0 6`n0000000000 65535 f `n")
  foreach ($off in $offsets) {
    $null = $pdf.Append(("{0:D10} 00000 n `n" -f $off))
  }
  $null = $pdf.Append("trailer`n<< /Size 6 /Root 1 0 R >>`nstartxref`n$xrefStart`n%%EOF`n")

  [System.IO.File]::WriteAllText($Path, $pdf.ToString(), [System.Text.Encoding]::ASCII)
}

Write-PdfDocument -Path (Join-Path $outDir 'brochure.pdf') -Title 'AgriNode Platform Brochure | 2026' -Lines @(
'## AgriNode Overview',
'AgriNode is a village agriculture intelligence platform connecting farmers, field agents, buyers, and admins.',
'It provides one digital workflow for crop planning, finance tracking, market discovery, and government scheme access.',
'',
'## Vision',
'To build a trusted data network that improves farm decisions and rural incomes in every district we serve.',
'',
'## Mission',
'To give farmers timely market, weather, finance, and advisory information in their language through assisted digital tools.',
'---',
'## Core Features',
'- Farmer onboarding and KYC workflows with agent approval',
'- Crop lifecycle tracking with expected and actual yield data',
'- Finance dashboard for income, expenses, and seasonal profitability',
'- Daily market price updates across major APMC mandis',
'- Government schemes and loan support with status tracking',
'- Admin command center with audit logs and export reports',
'---',
'## Benefits for Farmers',
'- Better crop planning through data-backed recommendations',
'- Faster access to schemes, subsidies, and loan channels',
'- Higher selling confidence using daily mandi price references',
'',
'## Benefits for Agents',
'- Streamlined farmer management and approval workflows',
'- Cleaner field reporting with export-ready records',
'- Better service quality through real-time support visibility',
'',
'## Benefits for Admins',
'- Single view of platform operations and service quality',
'- Traceable exports for compliance and audits',
'- Data for village and district growth planning',
'---',
'Contact: support@agrinode.in | Helpline: 1800-180-2474 | Hubli, Karnataka'
)

Write-PdfDocument -Path (Join-Path $outDir 'annual-report.pdf') -Title 'AgriNode Annual Report FY 2025-26' -Lines @(
'## Executive Snapshot',
'FY 2025-26 was a high-growth year with expansion across new villages and stronger loan and scheme facilitation.',
'',
'## Dummy Statistics',
'- Registered Farmers: 12,840 (up 38% YoY)',
'- Active Field Agents: 356 (up 29% YoY)',
'- Villages Covered: 412 (up 34% YoY)',
'- Crop Records Processed: 18,420 (up 41% YoY)',
'- Complaints Resolved Within SLA: 93.2%',
'---',
'## Production Numbers (Sample)',
'Paddy: 5.62 lakh quintals',
'Wheat: 3.44 lakh quintals',
'Cotton: 1.82 lakh quintals',
'Sugarcane: 8.12 lakh quintals',
'Maize and Pulses: 2.95 lakh quintals',
'---',
'## Revenue Summary (Dummy)',
'Gross Platform-linked Transaction Value: Rs 84.6 crore',
'Service Revenue: Rs 6.9 crore',
'Operations Cost: Rs 4.8 crore',
'Operating Margin: 30.4%',
'Average Farmer Income Lift (sample cohort): 18.7%',
'---',
'## Village Analytics (Sample)',
'High-performing clusters: Dharwad North, Kundgol East, Haveri Belt',
'Yield improvement hotspots: irrigated paddy and cotton blocks',
'Risk areas: rain-fed maize villages with high fertilizer cost variance',
'Recommended focus: water advisory campaigns and price intelligence training',
'---',
'Prepared for demo and training use only. Not for statutory filing.'
)

Write-PdfDocument -Path (Join-Path $outDir 'user-guide.pdf') -Title 'AgriNode User Guide | Demo Edition 2026' -Lines @(
'## Login Instructions',
'1. Open login page and choose language (EN/HI/KN).',
'2. Select role: Farmer, Agent, or Admin.',
'3. Use password mode or OTP mode and submit credentials.',
'4. On success, user is redirected to role-specific dashboard.',
'---',
'## Dashboard Usage',
'- Review KPIs for farmers, crops, finance, and system status.',
'- Use quick links for schemes, loans, APMC, and support.',
'- Access reports and downloads from the Downloads Center.',
'---',
'## Farmer Workflow',
'- Update profile and KYC documents.',
'- Track crop progress and expected harvest timeline.',
'- Review income/expense records and export farmer reports.',
'- Raise support tickets and monitor resolution status.',
'---',
'## Agent Workflow',
'- Onboard farmers and verify submitted details.',
'- Manage marketplace listings and buyer interactions.',
'- Track payments and export records for field follow-up.',
'- Support scheme enrollment and loan requests.',
'---',
'## Admin Workflow',
'- Approve/reject users and monitor compliance status.',
'- Review audits, complaints, and operational metrics.',
'- Export annual, village analytics, and CSV data reports.',
'- Maintain platform health and service standards.',
'---',
'Helpdesk: support@agrinode.in | Helpline: 1800-180-2474'
)

Write-PdfDocument -Path (Join-Path $outDir 'farmer-report.pdf') -Title 'AgriNode Farmer Performance Report | Sample' -Lines @(
'## Farmer Summary',
'Farmer Name: Geetha Devi | Village: Devapur | District: Dharwad | Land: 3.0 acres',
'Primary Crops: Paddy, Maize | KYC Status: Verified | Agent: Ramesh Kumar',
'---',
'## Crop Performance (Dummy)',
'Kharif Paddy: Area 1.8 acres | Expected Yield 63 qtl | Actual Yield 58 qtl',
'Rabi Wheat: Area 1.2 acres | Expected Yield 28 qtl | Current Stage: Flowering',
'Soil and input quality score: 8.1 / 10',
'---',
'## Financial Snapshot (Dummy)',
'Total Crop Sales: Rs 1,84,000',
'Total Input Costs: Rs 62,500',
'Net Seasonal Margin: Rs 1,21,500',
'Pending Receivables: Rs 18,000',
'---',
'## Advisory Notes',
'- Maintain staggered irrigation schedule to reduce pump cost.',
'- Use village mandi alert for cotton and paddy daily pricing.',
'- Apply for drip support under PMKSY micro-irrigation component.',
'---',
'Generated for demo usage only.'
)

Write-PdfDocument -Path (Join-Path $outDir 'village-analytics-report.pdf') -Title 'AgriNode Village Analytics Report | Sample' -Lines @(
'## Coverage Snapshot',
'Cluster: North Karnataka Pilot | Villages Included: 42 | Active Farmers: 1,268',
'Period: Jan 2026 to Apr 2026',
'---',
'## Productivity Indicators',
'Average cultivated area per household: 3.9 acres',
'Average yield change vs previous season: +11.4%',
'Adoption of improved seed varieties: 67%',
'Rain-fed stress villages flagged: 8',
'---',
'## Market and Revenue Analytics',
'Average modal mandi price uplift after advisory: +6.8%',
'Estimated additional farmer revenue (cluster): Rs 1.92 crore',
'High volatility commodities: onion, tomato, cotton',
'---',
'## Risk and Support Index',
'KYC pending profiles: 9.7%',
'Open grievance tickets older than 7 days: 3.1%',
'Loan rejection concentration: two villages with low documentation quality',
'---',
'## Recommended Actions',
'- Conduct weekly documentation camps in low-compliance villages.',
'- Expand localized weather warning messages for rain-fed farmers.',
'- Prioritize buyer linkage for high-surplus cotton villages.',
'---',
'Demo analytics report generated by AgriNode frontend bundle.'
)

Set-Content -Path (Join-Path $outDir 'crop-data.csv') -Encoding utf8 -Value @'
Crop ID,Farmer ID,Farmer Name,Village,District,Crop,Season,Sowing Date,Harvest Date,Area Acres,Expected Yield Qtl,Actual Yield Qtl,Irrigation,Soil Type,Quality Grade,Market Value Rs
CR001,F001,Rajesh Patil,Shigli,Dharwad,Paddy,Kharif,2025-06-01,2025-10-30,4.5,38.0,36.8,Drip+Rain,Black Cotton,A,84640
CR002,F002,Suresh Kumar,Kundgol,Dharwad,Wheat,Rabi,2025-11-15,2026-03-25,3.0,32.0,31.2,Canal,Red Loamy,A,64896
CR003,F003,Lakshmi Devi,Navalagund,Dharwad,Cotton,Kharif,2025-06-01,2025-12-20,5.0,12.0,11.4,Borewell,Black Cotton,A,73188
CR004,F004,Ramesh Naik,Annigeri,Dharwad,Maize,Kharif,2025-06-15,2025-10-15,2.5,28.0,26.5,Rain-fed,Red Sandy,B,37324
CR005,F005,Geetha Bai,Hubli,Dharwad,Sugarcane,Annual,2025-01-01,2025-12-31,3.0,310.0,295.0,Drip,Black Cotton,A,170025
CR006,F006,Prakash Reddy,Ron,Gadag,Tur Dal,Kharif,2025-06-20,2025-12-15,4.0,8.0,7.6,Rain-fed,Red Loamy,A,53200
CR007,F007,Anitha S,Lakshmeshwar,Gadag,Groundnut,Kharif,2025-06-01,2025-09-30,3.5,20.0,19.2,Rain-fed,Sandy Loam,A,96000
CR008,F008,Mallikarjun B,Mundargi,Gadag,Sunflower,Rabi,2025-11-01,2026-02-28,4.5,12.0,11.8,Canal,Black Cotton,A,85960
CR009,F009,Kavitha P,Shirahatti,Gadag,Jowar,Kharif,2025-06-15,2025-11-30,2.0,14.0,13.4,Rain-fed,Red Loamy,B,20100
CR010,F010,Veeresh T,Naregal,Gadag,Bengal Gram,Rabi,2025-11-01,2026-02-28,3.0,10.0,9.6,Rain-fed,Black Cotton,A,43200
CR011,F011,Basavaraj M,Haveri,Haveri,Rice,Kharif,2025-06-05,2025-11-05,5.0,40.0,38.6,Canal,Black Cotton,A,88780
CR012,F012,Shobha V,Byadgi,Haveri,Byadgi Chilli,Kharif,2025-05-01,2025-11-30,2.0,14.0,13.4,Drip,Red Loamy,A,134000
CR013,F013,Manjunath K,Hirekerur,Haveri,Cotton,Kharif,2025-06-01,2025-12-20,4.0,11.0,10.8,Borewell,Black Cotton,A,69336
CR014,F014,Nagaraj R,Savanur,Haveri,Sunflower,Rabi,2025-11-01,2026-03-15,3.5,12.0,0.0,Canal,Black Cotton,Pending,0
CR015,F015,Pushpa D,Ranibennur,Haveri,Maize,Kharif,2025-06-20,2025-10-20,3.0,30.0,28.8,Rain-fed,Sandy Loam,A,40608
'@

Set-Content -Path (Join-Path $outDir 'farmer-records.csv') -Encoding utf8 -Value @'
Farmer ID,Name,Phone,Age,Gender,Village,Taluk,District,State,Land Acres,Primary Crop,Secondary Crop,PM KISAN,KCC Holder,KYC Status,Agent Assigned,Registered On,Total Income Rs,Total Expense Rs,Net Profit Rs,Status
F001,Rajesh Patil,9810012345,42,Male,Shigli,Dharwad,Dharwad,Karnataka,6.5,Paddy,Wheat,Yes,Yes,Verified,Ramesh Kumar,2022-03-12,180000,62000,118000,Active
F002,Suresh Kumar,9810023456,38,Male,Kundgol,Kundgol,Dharwad,Karnataka,5.0,Wheat,Chilli,Yes,Yes,Verified,Ramesh Kumar,2022-04-18,145000,48000,97000,Active
F003,Lakshmi Devi,9810034567,35,Female,Navalagund,Navalagund,Dharwad,Karnataka,5.5,Cotton,Jowar,Yes,No,Verified,Priya Sharma,2022-06-05,88000,32000,56000,Active
F004,Ramesh Naik,9810045678,55,Male,Annigeri,Navalgund,Dharwad,Karnataka,3.5,Maize,Pulses,Yes,Yes,Verified,Priya Sharma,2022-07-20,52000,28000,24000,Active
F005,Geetha Bai,9810056789,48,Female,Hubli,Hubli,Dharwad,Karnataka,4.0,Sugarcane,Paddy,Yes,No,Verified,Arun Joshi,2022-08-14,220000,75000,145000,Active
F006,Prakash Reddy,9810067890,44,Male,Ron,Ron,Gadag,Karnataka,4.5,Tur Dal,Groundnut,Yes,Yes,Verified,Meera Patil,2022-09-02,68000,24000,44000,Active
F007,Anitha S,9810078901,32,Female,Lakshmeshwar,Shirhatti,Gadag,Karnataka,3.5,Groundnut,Sunflower,Yes,No,Verified,Meera Patil,2022-10-10,112000,38000,74000,Active
F008,Mallikarjun B,9810089012,60,Male,Mundargi,Mundargi,Gadag,Karnataka,5.5,Sunflower,Jowar,Yes,Yes,Verified,Rajan Kulkarni,2022-11-25,96000,35000,61000,Active
F009,Kavitha P,9810090123,28,Female,Shirahatti,Shirahatti,Gadag,Karnataka,2.0,Jowar,Bajra,Yes,No,Pending,Rajan Kulkarni,2023-01-08,28000,14000,14000,Active
F010,Veeresh T,9810101234,50,Male,Naregal,Ron,Gadag,Karnataka,3.0,Bengal Gram,Linseed,Yes,Yes,Verified,Sita Ram,2023-02-14,58000,22000,36000,Active
F011,Basavaraj M,9810112345,46,Male,Haveri,Haveri,Haveri,Karnataka,6.0,Rice,Cotton,Yes,Yes,Verified,Sita Ram,2023-03-01,130000,44000,86000,Active
F012,Shobha V,9810123456,37,Female,Byadgi,Byadgi,Haveri,Karnataka,2.5,Chilli,Maize,Yes,No,Verified,Deepak T,2023-03-18,182000,60000,122000,Active
'@

Set-Content -Path (Join-Path $outDir 'market-prices.csv') -Encoding utf8 -Value @'
Date,APMC,District,Commodity,Variety,Min Price RsQtl,Max Price RsQtl,Modal Price RsQtl,Arrivals Qtl,Trend,MSP RsQtl,Above MSP,Grade
2026-05-24,Hubli APMC,Dharwad,Paddy,BPT 5204,2080,2480,2280,4200,Up,2300,No,A
2026-05-24,Hubli APMC,Dharwad,Wheat,HD 2967,1980,2180,2080,3100,Stable,2275,No,A
2026-05-24,Hubli APMC,Dharwad,Maize,DHM 117,1580,1860,1720,2800,Down,2090,No,B
2026-05-24,Hubli APMC,Dharwad,Cotton,Bt Hybrid,6200,6700,6450,1850,Up,7121,No,A
2026-05-24,Gadag APMC,Gadag,Sunflower,KBSH 44,6820,7560,7200,1420,Stable,7280,No,A
2026-05-24,Gadag APMC,Gadag,Groundnut,TMV 2,4820,5280,5060,720,Up,6377,No,A
2026-05-24,Belagavi APMC,Belagavi,Sugarcane,CO 86032,290,410,350,22000,Stable,,NA,A
2026-05-24,Belagavi APMC,Belagavi,Soybean,JS 335,4400,5000,4720,1200,Up,4892,No,A
2026-05-24,Vijayapura APMC,Vijayapura,Pomegranate,Bhagwa,10000,13000,11800,340,Up,,NA,A
2026-05-24,Vijayapura APMC,Vijayapura,Tur Dal,LRG 41,6700,7200,6980,480,Stable,7000,No,B
2026-05-23,Hubli APMC,Dharwad,Paddy,BPT 5204,2020,2460,2210,3900,Stable,2300,No,A
2026-05-23,Hubli APMC,Dharwad,Cotton,Bt Hybrid,6120,6680,6400,1720,Stable,7121,No,A
2026-05-22,Hubli APMC,Dharwad,Paddy,BPT 5204,1980,2420,2160,3600,Down,2300,No,A
'@

Write-Host 'Generated AgriNode demo download assets:'
Get-ChildItem -Path $outDir -File | Sort-Object Name | Select-Object Name, Length | Format-Table -AutoSize
