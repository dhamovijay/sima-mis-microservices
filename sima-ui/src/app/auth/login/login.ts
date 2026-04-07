import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, LoginRequest } from '../auth.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  username = '';
  password = '';
  isLoading = false;
  errorMessage = '';
  private chart: any;
  private chartInterval: any;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    // Check if user is already logged in
     
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['/dashboard']);
      }
    });

    // Initialize the chart after a brief delay to ensure DOM is ready
    setTimeout(() => {
      this.initChart();
    }, 100);
  } 
  initChart() {
    const chartContainer = this.elementRef.nativeElement.querySelector('#login-background-chart');

     const colorPalette = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', 
      '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
      '#10ac84', '#ee5a24', '#0984e3', '#a29bfe', '#fd79a8'
    ];

    const edgeColors = [
      '#ff7979', '#7ed6df', '#686de0', '#badc58', '#f9ca24',
      '#eb4d4b', '#6ab04c', '#30336b', '#130f40', '#22a6b3'
    ];

    // Neon color palette for edges
    const neonColors = [
      '#ff00ff', '#00ffff', '#ffff00', '#ff0000', '#00ff00',
      '#ff00cc', '#00ffcc', '#cc00ff', '#ffcc00', '#00ff66',
      '#ff6600', '#0066ff', '#ff3399', '#33ffcc', '#ff33cc'
    ];

    if (!chartContainer) {
      console.error('Chart container not found');
      return;
    }

    this.chart = echarts.init(chartContainer, 'dark', {
      renderer: 'canvas',
      useDirtyRect: false
    });

    const data = [
      {
        fixed: false,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        symbolSize: 20,
        id: '-1',
        itemStyle: {
          color: '#ff6b6b'
        }
      }
    ];

    // Add random nodes
    const initialNodeCount = 110; // Change this number

    for (let i = 0; i < initialNodeCount; i++) {
      data.push({
        fixed: false,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        symbolSize: 50 + Math.random() * 10,
        id: `initial-${i}`,
        itemStyle: {
          color: getRandomColor(colorPalette)
        }
      });
    }

    const edges: { source: number; target: number; lineStyle: { color: string; opacity: number; }; }[] = [];
 

    function getRandomColor(colorsArray: string[]) {
      return colorsArray[Math.floor(Math.random() * colorsArray.length)];
    }

    const option = {
      series: [
        {
          type: 'graph',
          layout: 'force',
          animation: true,
          data: data,
          force: {
            repulsion: 50,
            gravity: 0.1,
            friction: 0.8,
            edgeLength: 100,
            layoutAnimation: true,
            initLayout: 'circular',
            coolingFactor: 0.8,
            velocityDecay: 0.1
          },
          edges: edges,
          lineStyle: {
            color: 'source',
            curveness: 0,
            opacity: 1
          },
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 4
            }
          }
        }
      ]
    };

    this.chart.setOption(option);

    this.chartInterval = setInterval(() => {
      const newNodeId = data.length + '';
      const newNodeColor = getRandomColor(colorPalette);
      const shapes = ['circle', 'diamond', 'roundRect'];
      const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
      
      data.push({
        id: newNodeId,
         itemStyle: {
          color: newNodeColor
        },
        symbolSize: 50 + Math.random() * 10,
        fixed: false,
        x: 0,
        y: 0
      });
      
      const source = Math.round((data.length - 1) * Math.random());
      const target = Math.round((data.length - 1) * Math.random());
      
      if (source !== target) {
        const neonColor = getRandomColor(neonColors);
        edges.push({
          source: source,
          target: target,
          lineStyle: {
            color: neonColor,
            opacity: 0.4
          }
        });
      }
      
      this.chart.setOption({
        series: [
          {
            data: data,
            edges: edges,
            symbol: randomShape,
            itemStyle: {
              color:edgeColors,
              borderColor: '#ffffff',
              borderWidth: 0,
              opacity: 0.8
            },
            label: {
              show: false // Hide labels for background
            }
          }
        ]
      });
    }, 3000);

    window.addEventListener('resize', () => {
      this.chart.resize();
    });
  }

  login() {
    // Reset error message
    this.errorMessage = '';
    
    // Basic validation
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.isLoading = true;

    const loginRequest: LoginRequest = {
      username: this.username,
      password: this.password
    };

    this.authService.login(loginRequest).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          console.log('Login successful');
        } else {
          this.errorMessage = 'Invalid username or password';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login error:', error);
        this.errorMessage = 'Login failed. Please try again.';
        
        if (error.status === 401) {
          this.errorMessage = 'Invalid username or password';
        } else if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please check your connection.';
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again.';
        }
      }
    });
  }

  onInputChange() {
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }
}