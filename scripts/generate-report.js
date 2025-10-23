#!/usr/bin/env node

/**
 * Generate HTML Report from K6 JSON output
 * 
 * This script converts K6 JSON results into a beautiful HTML report
 */

const fs = require('fs');
const path = require('path');

// Find the most recent results file
function findLatestResults() {
  const reportsDir = path.join(__dirname, '..', 'reports');
  
  if (!fs.existsSync(reportsDir)) {
    console.error('❌ No reports directory found. Run tests first.');
    process.exit(1);
  }
  
  const files = fs.readdirSync(reportsDir)
    .filter(f => f.endsWith('.json'))
    .map(f => ({
      name: f,
      path: path.join(reportsDir, f),
      time: fs.statSync(path.join(reportsDir, f)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time);
  
  if (files.length === 0) {
    console.error('❌ No JSON results found. Run tests first.');
    process.exit(1);
  }
  
  return files[0];
}

// Parse K6 JSON output
function parseK6Results(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.trim().split('\n');
  
  let metrics = {
    http_req_duration: [],
    http_req_failed: [],
    http_reqs: 0,
    checks: []
  };
  
  lines.forEach(line => {
    try {
      const data = JSON.parse(line);
      
      if (data.type === 'Point') {
        // HTTP request duration
        if (data.metric === 'http_req_duration' && data.data && data.data.value !== undefined) {
          metrics.http_req_duration.push(data.data.value);
        }
        
        // HTTP request count
        if (data.metric === 'http_reqs' && data.data && data.data.value !== undefined) {
          metrics.http_reqs++;
        }
        
        // HTTP failed requests
        if (data.metric === 'http_req_failed' && data.data && data.data.value !== undefined) {
          metrics.http_req_failed.push(data.data.value);
        }
        
        // Checks
        if (data.metric === 'checks' && data.data && data.data.value !== undefined) {
          metrics.checks.push({
            value: data.data.value,
            time: data.data.time
          });
        }
      }
    } catch (e) {
      // Skip invalid lines
    }
  });
  
  return metrics;
}

// Calculate statistics
function calculateStats(values) {
  if (!values || values.length === 0) {
    return { min: 0, max: 0, avg: 0, p95: 0, p99: 0 };
  }
  
  const sorted = values.slice().sort((a, b) => a - b);
  const sum = sorted.reduce((a, b) => a + b, 0);
  
  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    avg: sum / sorted.length,
    p95: sorted[Math.floor(sorted.length * 0.95)] || sorted[sorted.length - 1] || 0,
    p99: sorted[Math.floor(sorted.length * 0.99)] || sorted[sorted.length - 1] || 0,
  };
}

// Generate HTML report
function generateHTML(metrics, sourceFile) {
  // Calculate key metrics
  const durationStats = calculateStats(metrics.http_req_duration);
  
  const httpReqs = metrics.http_reqs;
  const httpReqFailed = metrics.http_req_failed.filter(v => v === 1).length;
  const successRate = httpReqs > 0 ? ((httpReqs - httpReqFailed) / httpReqs * 100).toFixed(2) : 0;
  
  const checksTotal = metrics.checks.length;
  const checksPassed = metrics.checks.filter(c => c.value === 1).length;
  const checksRate = checksTotal > 0 ? (checksPassed / checksTotal * 100).toFixed(2) : 0;
  
  const timestamp = new Date().toISOString();
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>K6 Test Report - ${path.basename(sourceFile, '.json')}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      min-height: 100vh;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    .header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
      font-weight: 700;
    }
    .header p {
      font-size: 1.1em;
      opacity: 0.9;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      padding: 40px;
    }
    .stat-card {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 25px;
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }
    .stat-card:hover {
      transform: translateY(-5px);
    }
    .stat-card.success {
      background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
    }
    .stat-card.warning {
      background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
    }
    .stat-card.danger {
      background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
    }
    .stat-label {
      font-size: 0.9em;
      color: #555;
      margin-bottom: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .stat-value {
      font-size: 2.5em;
      font-weight: 700;
      color: #333;
    }
    .stat-unit {
      font-size: 0.5em;
      color: #666;
    }
    .metrics {
      padding: 40px;
      background: #f9fafb;
    }
    .metrics h2 {
      font-size: 1.8em;
      margin-bottom: 25px;
      color: #333;
      border-bottom: 3px solid #667eea;
      padding-bottom: 10px;
    }
    .metric-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      background: white;
      margin-bottom: 10px;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .metric-name {
      font-weight: 600;
      color: #555;
    }
    .metric-value {
      font-weight: 700;
      color: #667eea;
      font-size: 1.1em;
    }
    .footer {
      padding: 30px 40px;
      background: #2d3748;
      color: white;
      text-align: center;
    }
    .footer p {
      opacity: 0.8;
      font-size: 0.9em;
    }
    .badge {
      display: inline-block;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 0.85em;
      font-weight: 600;
      margin-left: 10px;
    }
    .badge.success { background: #48bb78; color: white; }
    .badge.warning { background: #ed8936; color: white; }
    .badge.danger { background: #f56565; color: white; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 K6 Performance Test Report</h1>
      <p>Contact List API - ${path.basename(sourceFile, '.json').replace(/-/g, ' ').toUpperCase()}</p>
      <p style="font-size: 0.9em; margin-top: 10px;">Generated: ${new Date(timestamp).toLocaleString()}</p>
    </div>
    
    <div class="stats">
      <div class="stat-card ${checksRate >= 95 ? 'success' : checksRate >= 80 ? 'warning' : 'danger'}">
        <div class="stat-label">✓ Checks Passed</div>
        <div class="stat-value">${checksRate}<span class="stat-unit">%</span></div>
        <div style="margin-top: 10px; font-size: 0.9em; color: #555;">
          ${checksPassed} / ${checksTotal} checks
        </div>
      </div>
      
      <div class="stat-card ${successRate >= 95 ? 'success' : successRate >= 90 ? 'warning' : 'danger'}">
        <div class="stat-label">📊 Success Rate</div>
        <div class="stat-value">${successRate}<span class="stat-unit">%</span></div>
        <div style="margin-top: 10px; font-size: 0.9em; color: #555;">
          ${httpReqs - httpReqFailed} / ${httpReqs} requests
        </div>
      </div>
      
      <div class="stat-card ${durationStats.avg < 300 ? 'success' : durationStats.avg < 500 ? 'warning' : 'danger'}">
        <div class="stat-label">⚡ Avg Response</div>
        <div class="stat-value">${durationStats.avg.toFixed(2)}<span class="stat-unit">ms</span></div>
        <div style="margin-top: 10px; font-size: 0.9em; color: #555;">
          Min: ${durationStats.min.toFixed(2)}ms | Max: ${durationStats.max.toFixed(2)}ms
        </div>
      </div>
      
      <div class="stat-card ${durationStats.p95 < 500 ? 'success' : durationStats.p95 < 1000 ? 'warning' : 'danger'}">
        <div class="stat-label">📈 P95 Response</div>
        <div class="stat-value">${durationStats.p95.toFixed(2)}<span class="stat-unit">ms</span></div>
        <div style="margin-top: 10px; font-size: 0.9em; color: #555;">
          95% of requests faster
        </div>
      </div>
      
      <div class="stat-card ${durationStats.p99 < 1000 ? 'success' : durationStats.p99 < 2000 ? 'warning' : 'danger'}">
        <div class="stat-label">🎯 P99 Response</div>
        <div class="stat-value">${durationStats.p99.toFixed(2)}<span class="stat-unit">ms</span></div>
        <div style="margin-top: 10px; font-size: 0.9em; color: #555;">
          99% of requests faster
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-label">🔄 Total Requests</div>
        <div class="stat-value">${httpReqs}</div>
        <div style="margin-top: 10px; font-size: 0.9em; color: #555;">
          ${httpReqFailed} failed
        </div>
      </div>
    </div>
    
    <div class="metrics">
      <h2>📋 Detailed Metrics</h2>
      
      <div class="metric-row">
        <span class="metric-name">Min Response Time</span>
        <span class="metric-value">${durationStats.min.toFixed(2)} ms</span>
      </div>
      
      <div class="metric-row">
        <span class="metric-name">Max Response Time</span>
        <span class="metric-value">${durationStats.max.toFixed(2)} ms</span>
      </div>
      
      <div class="metric-row">
        <span class="metric-name">Average Response Time</span>
        <span class="metric-value">${durationStats.avg.toFixed(2)} ms
          <span class="badge ${durationStats.avg < 300 ? 'success' : durationStats.avg < 500 ? 'warning' : 'danger'}">
            ${durationStats.avg < 300 ? 'Excellent' : durationStats.avg < 500 ? 'Good' : 'Needs Improvement'}
          </span>
        </span>
      </div>
      
      <div class="metric-row">
        <span class="metric-name">P95 Response Time</span>
        <span class="metric-value">${durationStats.p95.toFixed(2)} ms
          <span class="badge ${durationStats.p95 < 500 ? 'success' : durationStats.p95 < 1000 ? 'warning' : 'danger'}">
            ${durationStats.p95 < 500 ? 'Pass' : 'Threshold Exceeded'}
          </span>
        </span>
      </div>
      
      <div class="metric-row">
        <span class="metric-name">P99 Response Time</span>
        <span class="metric-value">${durationStats.p99.toFixed(2)} ms
          <span class="badge ${durationStats.p99 < 1000 ? 'success' : durationStats.p99 < 2000 ? 'warning' : 'danger'}">
            ${durationStats.p99 < 1000 ? 'Pass' : 'Threshold Exceeded'}
          </span>
        </span>
      </div>
      
      <div class="metric-row">
        <span class="metric-name">Total HTTP Requests</span>
        <span class="metric-value">${httpReqs}</span>
      </div>
      
      <div class="metric-row">
        <span class="metric-name">Failed Requests</span>
        <span class="metric-value">${httpReqFailed}
          <span class="badge ${httpReqFailed === 0 ? 'success' : httpReqFailed < 5 ? 'warning' : 'danger'}">
            ${httpReqs > 0 ? ((httpReqFailed / httpReqs) * 100).toFixed(2) : 0}% failure rate
          </span>
        </span>
      </div>
      
      <div class="metric-row">
        <span class="metric-name">Checks Passed</span>
        <span class="metric-value">${checksPassed} / ${checksTotal}
          <span class="badge ${checksRate >= 95 ? 'success' : checksRate >= 80 ? 'warning' : 'danger'}">
            ${checksRate}%
          </span>
        </span>
      </div>
    </div>
    
    <div class="footer">
      <p>Generated by K6 Contact List API Test Suite</p>
      <p style="margin-top: 10px; font-size: 0.85em;">TypeScript • K6 • Webpack • Performance Testing</p>
    </div>
  </div>
</body>
</html>`;
  
  return html;
}

// Main execution
function main() {
  console.log('📊 Generating HTML Report...\n');
  
  const latestFile = findLatestResults();
  console.log(`📁 Processing: ${latestFile.name}`);
  
  const metrics = parseK6Results(latestFile.path);
  const html = generateHTML(metrics, latestFile.name);
  
  const reportPath = path.join(__dirname, '..', 'reports', 'report.html');
  fs.writeFileSync(reportPath, html);
  
  console.log(`\n✅ Report generated successfully!`);
  console.log(`📍 Location: ${reportPath}`);
  console.log(`\n📊 Quick Stats:`);
  console.log(`   - Total Requests: ${metrics.http_reqs}`);
  console.log(`   - Checks: ${metrics.checks.filter(c => c.value === 1).length} / ${metrics.checks.length}`);
  console.log(`   - Avg Response: ${metrics.http_req_duration.length > 0 ? (metrics.http_req_duration.reduce((a,b) => a+b, 0) / metrics.http_req_duration.length).toFixed(2) : 0} ms`);
  console.log(`\n🌐 Open in browser:`);
  console.log(`   file://${reportPath}\n`);
  
  // Try to open in browser (macOS/Linux)
  const { exec } = require('child_process');
  if (process.platform === 'darwin') {
    exec(`open "${reportPath}"`);
    console.log('🚀 Opening report in default browser...\n');
  } else if (process.platform === 'linux') {
    exec(`xdg-open "${reportPath}"`);
    console.log('🚀 Opening report in default browser...\n');
  } else if (process.platform === 'win32') {
    exec(`start "${reportPath}"`);
    console.log('🚀 Opening report in default browser...\n');
  }
}

main();
