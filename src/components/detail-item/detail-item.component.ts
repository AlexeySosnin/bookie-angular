import { Component, OnInit, Input } from '@angular/core';
import { Live} from '../../core/models/live';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-detail-item',
  templateUrl: './detail-item.component.html',
  styleUrls: ['./detail-item.component.css']
})
export class DetailItemComponent implements OnInit {
 
  @Input()
  public data: any[];

  constructor(private readonly api: ApiService, private readonly router: Router) {
 
  }

  ngOnInit(): void {

  } 
}
