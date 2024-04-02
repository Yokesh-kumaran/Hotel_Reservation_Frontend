import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppResponse } from '../model/appResponse';
import { urlEndpoint } from '../utils/constant';
import { Addroom } from '../model/addroom';
import { Roomfilter } from '../model/roomfilter';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private http: HttpClient) {}

  getAllRooms(): Observable<AppResponse> {
    return this.http.get<AppResponse>(`${urlEndpoint.baseUrl}/admin/room/all`);
  }

  getRoomByCategoryId(categoryId: number): Observable<AppResponse> {
    return this.http.get<AppResponse>(
      `${urlEndpoint.baseUrl}/room/${categoryId}`
    );
  }

  createRoom(formData: FormData): Observable<AppResponse> {
    return this.http.post<AppResponse>(
      `${urlEndpoint.baseUrl}/admin/room`,
      formData
    );
  }

  updateRoom(formData: FormData): Observable<AppResponse> {
    return this.http.put<AppResponse>(
      `${urlEndpoint.baseUrl}/admin/room`,
      formData
    );
  }

  deleteRoom(id: number): Observable<AppResponse> {
    return this.http.delete<AppResponse>(
      `${urlEndpoint.baseUrl}/admin/room/${id}`
    );
  }

  filterRoom(roomFilter: Roomfilter): Observable<AppResponse> {
    return this.http.get<AppResponse>(
      `${urlEndpoint.baseUrl}/room/availableRooms/${roomFilter.startDate}/${roomFilter.endDate}/${roomFilter.place}`
    );
  }

  filterByPrice(
    minFilterPrice: number,
    maxFilterPrice: number,
    categoryId: number
  ): Observable<AppResponse> {
    return this.http.get<AppResponse>(
      `${urlEndpoint.baseUrl}/room/priceFilter/${minFilterPrice}/${maxFilterPrice}/${categoryId}`
    );
  }

  getFakeApi(): Observable<AppResponse> {
    return this.http.get<AppResponse>(
      `https://private-anon-e88e23125f-tshapiv20.apiary-mock.com/hotels/get_list/?api_key=testkey&chains=HS%2CRT&checkin=2018-10-28&configuration_id=3500000023&customer_ip=192.168.31.116&destination=Region%3A48.224147%2C16.350547&entity_id=23&exclude_non_traditional=false&hotel_name_keyword=mozart&is_multi_traveler_mode=false&limit=5&locale=en_US&nonce=1543353502645&order=-star_rating&page=1&search_radius=5&search_radius_unit=KM&session_id=71IxqHT8mgMe5ohsZ25e5P&star_rating_filter=3%2C4%2C5&suggest_alternative=false&system=obt&timestamp=1388774110&user_agent=Mozilla%2F5.0%20(Linux%3B%20Android%207.0%3B%20SM-G930V%20Build%2FNRD90M)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F59.0.3071.125%20Mobile%20Safari%2F537.36`
    );
  }
}
