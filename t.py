import hmac,hashlib,json,requests
k,s=open('creds').read().split()
U="https://jlwvqbrtdzwrcwelyylv.supabase.co/functions/v1/agent-api/agent/booking/v3.2"
def call(body,sec=s,key=k):
    raw=json.dumps(body)
    sig=hmac.new(sec.encode(),raw.encode(),hashlib.sha256).hexdigest().upper()
    r=requests.post(U,params={"apikey":key},data=raw,headers={"signature":sig,"Content-Type":"application/json"},timeout=60)
    return r.status_code,r.text[:300]
print("bad sig",call({"method":"step1"},sec="wrong"))
print("bad key",call({"method":"step1"},key="nope"))
print("step1",call({"method":"step1"}))
print("locations",call({"method":"locations"}))
print("step2",call({"method":"step2","pickuplocationid":1,"dropofflocationid":1,"pickupdate":"15/10/2026","pickuptime":"10:00","dropoffdate":"18/10/2026","dropofftime":"10:00","ageid":9}))
print("agentbookings",call({"method":"agentbookings","startdate":"01/09/2026","enddate":"30/09/2026"}))
